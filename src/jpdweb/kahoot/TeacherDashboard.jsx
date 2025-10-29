import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';
import QuizWebSocketService from '../../hooks/QuizWebSocketService';
import { useParams } from 'react-router-dom';
import { useAuth } from '../security/Authentication';

function TeacherDashboard() {
    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quizStatus, setQuizStatus] = useState('WAITING_FOR_PLAYERS');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [finalResults, setFinalResults] = useState(null);
    const [questionResult, setQuestionResult] = useState(null);
    const [showingResult, setShowingResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const { id } = useParams();
    const auth = useAuth();
    const teacherName = auth.creatorInfor.fullName;

    // ✨ ĐỊNH NGHĨA handleEndQuestion với useCallback
    const handleEndQuestion = useCallback(() => {
        if (session && connected && currentQuestion && !showingResult) {
            console.log('🏁 Ending question...');
            QuizWebSocketService.endQuestion();
        }
    }, [session, connected, currentQuestion, showingResult]);

    // ✨ ĐỊNH NGHĨA connectWebSocket với useCallback
    const connectWebSocket = useCallback(async (sessionCode) => {
        try {
            await QuizWebSocketService.connect(sessionCode, {
                onConnected: () => {
                    console.log('✅ WebSocket connected');
                    setConnected(true);
                    QuizWebSocketService.getParticipants();
                },
                onParticipantJoined: (data) => {
                    console.log('👤 Participant joined:', data);
                    setParticipants(prev => [...prev, data.participant]);
                },
                onParticipantsList: (data) => {
                    console.log('👥 Participants list:', data);
                    setParticipants(data.participants);
                },
                onError: (error) => {
                    console.error('❌ WebSocket error:', error);
                    setConnected(false);
                },
                onQuestionStarted: (data) => {
                    console.log('❓ New Question Started:', data);
                    setCurrentQuestion(data);
                    setShowingResult(false);
                    setQuestionResult(null);
                    setTimerActive(true);
                },
                onQuestionEnded: (data) => {
                    console.log('🏁 Question ended, received results:', data);
                    setQuestionResult(data);
                    setShowingResult(true);
                    setTimerActive(false);
                },
                onQuizStarted: (data) => {
                    console.log('🎉 Quiz started broadcast received!', data);
                    setQuizStatus('ACTIVE');
                },
                onQuizFinished: (data) => {
                    console.log('🏁 Quiz finished broadcast received!', data);
                    setQuizStatus('FINISHED');
                    setTimerActive(false);
                    setCurrentQuestion(null);
                    fetchFinalResults(sessionCode);
                }
            });
        } catch (error) {
            console.error('❌ Failed to connect WebSocket:', error);
            alert('Failed to connect WebSocket');
        }
    }, []);

    // ✨ TỰ ĐỘNG TẠO SESSION KHI COMPONENT LOAD
    useEffect(() => {
        const autoCreateSession = async () => {
            if (id && teacherName && !session) {
                console.log('🎬 Auto-creating session with kahootId:', id, 'and teacher:', teacherName);
                setLoading(true);
                try {
                    const response = await axios.post('http://localhost:9090/api/quiz/create', {
                        kahootId: parseInt(id),
                        teacherId: 1,
                        teacherName: teacherName
                    });

                    const sessionData = response.data;
                    setSession(sessionData);
                    console.log('✅ Session auto-created:', sessionData);

                    await connectWebSocket(sessionData.sessionCode);

                } catch (error) {
                    console.error('❌ Error auto-creating session:', error);
                    alert('Failed to create session: ' + error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        autoCreateSession();
    }, [id, teacherName, session, connectWebSocket]);

    // Cleanup WebSocket khi component unmount
    useEffect(() => {
        return () => {
            QuizWebSocketService.disconnect();
        };
    }, []);

    // ✨ Timer đếm ngược - SỬ DỤNG handleEndQuestion từ useCallback
    useEffect(() => {
        if (quizStatus !== 'ACTIVE' || !timerActive || !currentQuestion || showingResult) {
            return;
        }

        console.log("⏱️ Starting timer for question...");
        
        const questionTimeLimit = currentQuestion.timeLimit || 30;
        setTimeLeft(questionTimeLimit);

        const countdownInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    console.log("⏰ Time's up! Auto-ending question.");
                    handleEndQuestion();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            console.log("🛑 Clearing countdown interval.");
            clearInterval(countdownInterval);
        };
        
    }, [quizStatus, timerActive, currentQuestion, showingResult, handleEndQuestion]);

    // ✨ Tự động chuyển câu hỏi sau khi hiển thị kết quả
    useEffect(() => {
        if (showingResult && questionResult) {
            console.log("📊 Showing results for 5 seconds...");
            
            const resultTimer = setTimeout(() => {
                console.log("⏰ Result display time ended. Moving to next question.");
                setShowingResult(false);
                setQuestionResult(null);
                QuizWebSocketService.startNextQuestion();
            }, 5000);

            return () => clearTimeout(resultTimer);
        }
    }, [showingResult, questionResult]);

    const fetchFinalResults = async (sessionCode) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:9090/api/quiz/${sessionCode}/participants`);
            console.log('🏆 Final results fetched:', response.data);
            setFinalResults(response.data);
        } catch (error) {
            console.error('❌ Error fetching final results:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 403) {
                alert('Error: Quiz chưa kết thúc hoặc bạn không có quyền truy cập.');
            } else {
                alert('Failed to fetch final results: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshParticipants = () => {
        QuizWebSocketService.getParticipants();
    };

    const copySessionCode = () => {
        navigator.clipboard.writeText(session.sessionCode);
        alert('Session code copied!');
    };

    const handleStartQuiz = () => {
        if (session && connected && participants.length > 0) {
            console.log(`🎬 Attempting to start quiz for session: ${session.sessionCode}`);
            QuizWebSocketService.startQuiz();
        } else {
            alert('Cannot start quiz. Check connection and participants.');
        }
    };

    // ✨ HÀM RENDER KẾT QUẢ CÂU HỎI
    const renderQuestionResult = () => {
        if (!questionResult) return null;

        return (
            <div className="question-result-overlay">
                <div className="question-result-container">
                    <h2>📊 Kết Quả Câu Hỏi</h2>
                    
                    <div className="correct-answer-section">
                        <h3>✅ Đáp Án Đúng:</h3>
                        <div className="correct-answer-display">
                            {questionResult.correctAnswer}
                        </div>
                    </div>

                    <div className="results-table">
                        <h3>👥 Kết Quả Người Chơi</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Câu Trả Lời</th>
                                    <th>Kết Quả</th>
                                    <th>Điểm</th>
                                    <th>Tổng Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questionResult.results.map((result) => (
                                    <tr key={result.participantId} className={result.correct ? 'correct-row' : 'incorrect-row'}>
                                        <td>{result.participantName}</td>
                                        <td>{result.answer}</td>
                                        <td>
                                            {result.correct ? '✅ Đúng' : '❌ Sai'}
                                        </td>
                                        <td className="points-cell">+{result.points}</td>
                                        <td className="total-score-cell">{result.totalScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="next-question-notice">
                        ⏰ Chuyển sang câu hỏi tiếp theo sau 5 giây...
                    </p>
                </div>
            </div>
        );
    };

    const renderFinalResults = () => {
        if (!finalResults || finalResults.length === 0) {
            return <p>Không có dữ liệu kết quả.</p>;
        }

        return (
            <div className="final-results-container">
                <h3>🏆 Bảng Xếp Hạng Chung Cuộc</h3>
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th>Tên Người Chơi</th>
                            <th>ID Tham Gia</th>
                            <th>Tổng Điểm</th>
                            <th>Thời Gian Tham Gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalResults.map((p, index) => (
                            <tr key={p.participantId} className={`rank-row rank-${index + 1}`}>
                                <td>#{index + 1}</td>
                                <td className="participant-name-col">
                                    <strong>{p.name}</strong>
                                </td>
                                <td>{p.participantId.substring(0, 8)}...</td>
                                <td className="score-col">
                                    🥇 {p.currentScore.toLocaleString()}
                                </td>
                                <td>
                                    {new Date(p.joinedAt).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <button 
                    className="btn-finish" 
                    onClick={() => {
                        setSession(null);
                        setParticipants([]);
                        setQuizStatus('WAITING_FOR_PLAYERS');
                        setFinalResults(null);
                        QuizWebSocketService.disconnect();
                    }}>
                    Tạo Session Mới
                </button>
            </div>
        );
    };

    return (
        <div className="teacher-dashboard">
            <h1>🎓 Teacher Dashboard</h1>

            {loading && !session ? (
                <div className="loading-session">
                    <h2>⏳ Đang tạo session...</h2>
                    <p>Vui lòng đợi trong giây lát</p>
                </div>
            ) : !session ? (
                <div className="error-session">
                    <h2>❌ Không thể tạo session</h2>
                    <p>Vui lòng kiểm tra lại thông tin và thử lại</p>
                </div>
            ) : (
                <div className="session-active">
                    <div className="session-info">
                        <h2>
                            📌 Session Created!
                            {quizStatus === 'FINISHED' && <span className="finished-tag"> (KẾT THÚC)</span>}
                        </h2>
                        <div className="session-code">
                            <span className="code">{session.sessionCode}</span>
                            <button onClick={copySessionCode}>📋 Copy</button>
                        </div>
                        <p className="session-title">📚 {session.title}</p>
                        <p className="session-questions">❓ {session.totalQuestions} questions</p>
                        <div className="status">
                            {connected ? (
                                <span className="connected">🟢 Connected</span>
                            ) : (
                                <span className="disconnected">🔴 Disconnected</span>
                            )}
                        </div>
                    </div>

                    {/* ✨ HIỂN THỊ KẾT QUẢ CÂU HỎI */}
                    {showingResult && renderQuestionResult()}

                    {quizStatus === 'FINISHED' && finalResults ? (
                        renderFinalResults()
                    ) : (
                        <>
                            {/* ✨ HIỂN THỊ CÂU HỎI HIỆN TẠI VÀ TIMER */}
                            {currentQuestion && !showingResult && (
                                <div className="current-question-panel">
                                    <h3>❓ Câu Hỏi Hiện Tại</h3>
                                    <div className="question-display">
                                        <p className="question-number">
                                            Câu {currentQuestion.questionNumber}/{session.totalQuestions}
                                        </p>
                                        <h4>{currentQuestion.question.content}</h4>
                                        <div className="timer-display">
                                            ⏱️ Thời gian còn lại: <strong>{timeLeft}s</strong>
                                        </div>
                                        <button 
                                            className="btn-end-question" 
                                            onClick={handleEndQuestion}
                                            disabled={showingResult}
                                        >
                                            🏁 Kết Thúc Câu Hỏi Ngay
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="qr-code">
                                <h3>QR Code for Students:</h3>
                                <img src={session.qrCodeUrl} alt="QR Code" />
                                <p className="join-url">{session.joinUrl}</p>
                            </div>

                            <div className="participants-section">
                                <div className="participants-header">
                                    <h3>👥 Participants ({participants.length})</h3>
                                    <button onClick={refreshParticipants}>🔄 Refresh</button>
                                </div>
                                
                                {participants.length === 0 ? (
                                    <p className="waiting">Waiting for participants to join...</p>
                                ) : (
                                    <div className="participants-list">
                                        {participants.map((participant, index) => (
                                            <div key={participant.participantId} className="participant-card">
                                                <span className="participant-number">{index + 1}</span>
                                                <span className="participant-name">{participant.name}</span>
                                                <span className="participant-score">
                                                    🏆 {participant.currentScore} điểm
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="actions">
                                <button 
                                    className="btn-start" 
                                    onClick={handleStartQuiz}
                                    disabled={participants.length === 0 || !connected || quizStatus !== 'WAITING_FOR_PLAYERS'}
                                >
                                    {quizStatus === 'ACTIVE' ? 'Quiz Đang Chạy' : '🚀 Start Quiz'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;