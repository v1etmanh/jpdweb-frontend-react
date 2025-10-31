import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuizWebSocketService from '../../hooks/QuizWebSocketService';
import { useParams } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';

function TeacherDashboard() {
    const [kahootId, setKahootId] = useState('1');
    const [teacherName, setTeacherName] = useState('Teacher');
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

    const handleEndQuestion = useCallback(() => {
        if (session && connected && currentQuestion && !showingResult) {
            console.log('🏁 Ending question...');
            QuizWebSocketService.endQuestion();
        }
    }, [session, connected, currentQuestion, showingResult]);

    useEffect(() => {
        return () => {
            QuizWebSocketService.disconnect();
        };
    }, []);

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

    // Không cần fetchFinalResults nữa, sử dụng participants từ WebSocket

    const createSession = async () => {
        setLoading(true);
        try {
            const response = await sessionApi.createSession({
                kahootId: parseInt(id),
                teacherName: teacherName
            });

            const sessionData = response.data;
            setSession(sessionData);
            console.log('✅ Session created:', sessionData);

            await connectWebSocket(sessionData.sessionCode);

        } catch (error) {
            console.error('❌ Error creating session:', error);
            alert('Failed to create session: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const connectWebSocket = async (sessionCode) => {
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
                    // Sắp xếp participants hiện tại theo điểm và set vào finalResults
                    setParticipants(prev => {
                        const sortedParticipants = [...prev].sort((a, b) => b.currentScore - a.currentScore);
                        setFinalResults(sortedParticipants);
                        return prev;
                    });
                }
            });
        } catch (error) {
            console.error('❌ Failed to connect WebSocket:', error);
            alert('Failed to connect WebSocket');
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

    const renderQuestionResult = () => {
        if (!questionResult) return null;

        // Sắp xếp kết quả theo totalScore giảm dần
        const sortedResults = [...questionResult.results].sort((a, b) => b.totalScore - a.totalScore);

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
                        <h2 className="text-3xl font-black text-center">📊 Kết Quả Câu Hỏi</h2>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        {/* Left Side - Question Results */}
                        <div>
                            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">✅</span>
                                    Đáp Án Đúng:
                                </h3>
                                <div className="text-2xl font-black text-green-600">
                                    {questionResult.correctAnswer}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">📝 Chi Tiết Câu Trả Lời</h3>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-3 py-2 text-left font-bold text-gray-700 text-sm rounded-tl-xl">Tên</th>
                                            <th className="px-3 py-2 text-center font-bold text-gray-700 text-sm">Trả Lời</th>
                                            <th className="px-3 py-2 text-center font-bold text-gray-700 text-sm rounded-tr-xl">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questionResult.results.map((result, index) => (
                                            <tr 
                                                key={result.participantId} 
                                                className={`border-b border-gray-200 ${
                                                    result.correct ? 'bg-green-50' : 'bg-red-50'
                                                } hover:bg-opacity-70 transition-colors`}
                                            >
                                                <td className="px-3 py-2 font-semibold text-sm">{result.participantName}</td>
                                                <td className="px-3 py-2 text-center text-xl">
                                                    {result.correct ? '✅' : '❌'}
                                                </td>
                                                <td className={`px-3 py-2 text-center font-bold ${
                                                    result.correct ? 'text-green-600' : 'text-gray-400'
                                                }`}>
                                                    +{result.points}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Side - Leaderboard */}
                        <div>
                            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-3xl">🏆</span>
                                Bảng Xếp Hạng
                            </h3>
                            <div className="space-y-3">
                                {sortedResults.map((result, index) => (
                                    <div 
                                        key={result.participantId}
                                        className={`rounded-2xl p-4 transform transition-all ${
                                            index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-4 border-yellow-400 scale-105' :
                                            index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-3 border-gray-400' :
                                            index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-3 border-orange-400' :
                                            'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-2xl font-black ${
                                                    index === 0 ? 'text-yellow-600' :
                                                    index === 1 ? 'text-gray-600' :
                                                    index === 2 ? 'text-orange-600' :
                                                    'text-gray-500'
                                                }`}>
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-800">
                                                        {result.participantName}
                                                    </div>
                                                    {result.correct && (
                                                        <div className="text-xs text-green-600 font-semibold">
                                                            +{result.points} điểm câu này
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`text-3xl font-black ${
                                                index === 0 ? 'text-yellow-600' :
                                                index === 1 ? 'text-gray-600' :
                                                index === 2 ? 'text-orange-600' :
                                                'text-purple-600'
                                            }`}>
                                                {result.totalScore}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-6 py-3 font-semibold animate-pulse">
                            <span className="text-xl">⏰</span>
                            Chuyển sang câu hỏi tiếp theo sau 5 giây...
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFinalResults = () => {
        if (!finalResults || finalResults.length === 0) {
            return <p className="text-center text-gray-600">Không có dữ liệu kết quả.</p>;
        }

        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-8 text-center">
                        <h3 className="text-5xl font-black mb-2">🏆 Bảng Xếp Hạng</h3>
                        <p className="text-xl font-semibold opacity-90">Kết Quả Chung Cuộc</p>
                    </div>

                    <div className="p-8">
                        {finalResults.map((p, index) => (
                            <div 
                                key={p.participantId}
                                className={`mb-4 rounded-2xl p-6 transform transition-all hover:scale-105 ${
                                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-4 border-yellow-400' :
                                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-4 border-gray-400' :
                                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-4 border-orange-400' :
                                    'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-4xl font-black ${
                                            index === 0 ? 'text-yellow-600' :
                                            index === 1 ? 'text-gray-600' :
                                            index === 2 ? 'text-orange-600' :
                                            'text-gray-400'
                                        }`}>
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-gray-800">
                                                {p.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {p.participantId.substring(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-4xl font-black ${
                                            index === 0 ? 'text-yellow-600' :
                                            index === 1 ? 'text-gray-600' :
                                            index === 2 ? 'text-orange-600' :
                                            'text-purple-600'
                                        }`}>
                                            {p.currentScore}
                                        </div>
                                        <div className="text-sm text-gray-500">điểm</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50 rounded-b-3xl">
                        <button 
                            onClick={() => {
                                setSession(null);
                                setParticipants([]);
                                setQuizStatus('WAITING_FOR_PLAYERS');
                                setFinalResults(null);
                                QuizWebSocketService.disconnect();
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-black text-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🎯 Tạo Session Mới
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-black text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🎓 Teacher Dashboard
                </h1>

                {!session ? (
                    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
                            Create Quiz Session
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Your Name:
                                </label>
                                <input
                                    type="text"
                                    value={teacherName}
                                    onChange={(e) => setTeacherName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>
                            
                            <button 
                                onClick={createSession} 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                            >
                                {loading ? '⏳ Creating...' : '🚀 Create Session'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {showingResult && renderQuestionResult()}

                        {quizStatus === 'FINISHED' && finalResults ? (
                            renderFinalResults()
                        ) : (
                            <>
                                <div className="bg-white rounded-3xl shadow-xl p-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black text-gray-800 mb-2">
                                                📌 Session Active
                                                {quizStatus === 'FINISHED' && <span className="ml-2 text-red-600">(KẾT THÚC)</span>}
                                            </h2>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-4xl font-black text-purple-600">
                                                    {session.sessionCode}
                                                </span>
                                                <button 
                                                    onClick={copySessionCode}
                                                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl font-bold transition-colors"
                                                >
                                                    📋 Copy
                                                </button>
                                            </div>
                                            <p className="text-gray-600 font-semibold">
                                                📚 {session.title} • ❓ {session.totalQuestions} questions
                                            </p>
                                        </div>
                                        <div className={`px-6 py-3 rounded-full font-bold ${
                                            connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {connected ? '🟢 Connected' : '🔴 Disconnected'}
                                        </div>
                                    </div>
                                </div>

                                {currentQuestion && !showingResult && (
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-6 text-white">
                                        <h3 className="text-2xl font-black mb-4">❓ Câu Hỏi Hiện Tại</h3>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                            <p className="text-lg font-semibold mb-2">
                                                Câu {currentQuestion.questionNumber}/{session.totalQuestions}
                                            </p>
                                            <h4 className="text-2xl font-bold mb-4">
                                                {currentQuestion.question.content}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-black">
                                                    ⏱️ {timeLeft}s
                                                </div>
                                                <button 
                                                    onClick={handleEndQuestion}
                                                    disabled={showingResult}
                                                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                                >
                                                    🏁 Kết Thúc Ngay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
                                    <h3 className="text-2xl font-black text-gray-800 mb-4">
                                        📱 QR Code for Students
                                    </h3>
                                    <img 
                                        src={session.qrCodeUrl} 
                                        alt="QR Code" 
                                        className="mx-auto w-48 h-48 rounded-2xl shadow-lg mb-4"
                                    />
                                    <p className="text-purple-600 font-bold text-lg">
                                        {session.joinUrl}
                                    </p>
                                </div>

                                <div className="bg-white rounded-3xl shadow-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-black text-gray-800">
                                            👥 Participants ({participants.length})
                                        </h3>
                                        <button 
                                            onClick={refreshParticipants}
                                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl font-bold transition-colors"
                                        >
                                            🔄 Refresh
                                        </button>
                                    </div>
                                    
                                    {participants.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <div className="text-6xl mb-4">👥</div>
                                            <p className="text-xl font-semibold">
                                                Waiting for participants...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {participants.map((participant, index) => (
                                                <div 
                                                    key={participant.participantId}
                                                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-2xl font-black text-purple-600">
                                                                #{index + 1}
                                                            </div>
                                                            <div className="font-bold text-gray-800">
                                                                {participant.name}
                                                            </div>
                                                        </div>
                                                        <div className="text-xl font-black text-purple-600">
                                                            🏆 {participant.currentScore}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {quizStatus === 'WAITING_FOR_PLAYERS' && (
                                    <button 
                                        onClick={handleStartQuiz}
                                        disabled={participants.length === 0 || !connected}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 rounded-3xl font-black text-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl"
                                    >
                                        {quizStatus === 'ACTIVE' ? 'Quiz Đang Chạy' : '🚀 Start Quiz'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default TeacherDashboard;