import React, { useState, useEffect, useCallback, useRef } from 'react';

import QuizWebSocketService from '../../hooks/QuizWebSocketService';
import { useParams } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import audioSrc from "../../images/The-Future-Is-Yours.mp3";//The-Future-Is-Yours.mp3
function TeacherDashboard() {
    const [teacherName, setTeacherName] = useState('Teacher');
    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
  
  // State để theo dõi trạng thái phát nhạc (optional - cho UI control)
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Volume mặc định 50%
   useEffect(() => {
    console.log('🎵 [Step 1] Initializing audio...');
    
    // ============================================
    // BƯỚC 1: Khởi tạo và Tải âm thanh
    // ============================================
    
    // Tạo Audio element
    const audio = new Audio(audioSrc);
    
    // Cấu hình thuộc tính cơ bản
    audio.loop = true;              // Bật chế độ lặp
    audio.volume = volume;          // Thiết lập âm lượng
    audio.preload = 'auto';         // Tải trước toàn bộ file
    
    // Lưu vào ref để có thể truy cập ở nơi khác
    audioRef.current = audio;

    // ============================================
    // BƯỚC 2: Phát âm thanh tự động
    // ============================================
    
    /**
     * Hàm khởi động phát nhạc
     * Xử lý các trường hợp lỗi autoplay do browser policy
     */
    const startPlayback = async () => {
      try {
        console.log('🎵 [Step 2] Attempting to play audio...');
        
        // play() trả về Promise, cần await
        await audio.play();
        
        setIsPlaying(true);
        console.log('✅ Audio is playing successfully!');
        
      } catch (error) {
        console.warn('⚠️ Autoplay blocked by browser:', error);
        
        // Xử lý khi autoplay bị chặn
        // Có thể hiển thị button cho user click để bật nhạc
        setIsPlaying(false);
        
        // Hoặc retry sau một khoảng thời gian
        // setTimeout(startPlayback, 1000);
      }
    };

    // Event listeners để tracking trạng thái
    const handlePlay = () => {
      console.log('🎵 Audio started playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Audio paused');
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('🔄 Audio ended (will loop automatically)');
    };

    const handleError = (e) => {
      console.error('❌ Audio error:', e);
      setIsPlaying(false);
    };

    // Gắn event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Bắt đầu phát
    startPlayback();

    // ============================================
    // BƯỚC 3: Cleanup Function - QUAN TRỌNG!
    // ============================================
    
    /**
     * Cleanup function được gọi khi:
     * - Component unmount
     * - Dependencies thay đổi (nếu có)
     * 
     * Mục đích:
     * - Dừng phát nhạc
     * - Gỡ bỏ event listeners (tránh memory leak)
     * - Giải phóng tài nguyên audio
     */
    return () => {
      console.log('🧹 [Step 3] Cleaning up audio resources...');
      
      // 1. Dừng phát nhạc
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset về đầu
      }
      
      // 2. Gỡ bỏ tất cả event listeners
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      // 3. Giải phóng tài nguyên
      audio.src = ''; // Xóa source
      audioRef.current = null;
      
      console.log('✅ Cleanup completed!');
    };
    
  }, [volume]);
    // Nhóm quiz state lại
    const [quizState, setQuizState] = useState({
        status: 'WAITING_FOR_PLAYERS',
        currentQuestion: null,
        timerActive: false,
        showingResult: false,
        timeLeft: 0
    });
    
    const [questionResult, setQuestionResult] = useState(null);
    const [finalResults, setFinalResults] = useState(null);
    
    const { id } = useParams();
    
    // Dùng ref để tránh stale closure
    const questionEndedRef = useRef(false);
    const timerRef = useRef(null);
    const resultTimerRef = useRef(null);

    // ✅ Cleanup tốt hơn
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
            QuizWebSocketService.disconnect();
        };
    }, []);

    // ✅ handleEndQuestion với debounce
    const handleEndQuestion = useCallback(() => {
        if (session && connected && quizState.currentQuestion && 
            !quizState.showingResult && !questionEndedRef.current) {
            console.log('🏁 Ending question...');
            questionEndedRef.current = true;
            QuizWebSocketService.endQuestion();
        }
    }, [session, connected, quizState.currentQuestion, quizState.showingResult]);

    // ✅ Timer effect được cải thiện
    useEffect(() => {
        // Cleanup previous timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (quizState.status !== 'ACTIVE' || !quizState.timerActive || 
            !quizState.currentQuestion || quizState.showingResult) {
            return;
        }

        console.log("⏱️ Starting timer for question...");
        questionEndedRef.current = false;
        
        const questionTimeLimit = quizState.currentQuestion.timeLimit || 30;
        setQuizState(prev => ({ ...prev, timeLeft: questionTimeLimit }));

        timerRef.current = setInterval(() => {
            setQuizState(prev => {
                const newTimeLeft = prev.timeLeft - 1;
                
                if (newTimeLeft <= 0) {
                    console.log("⏰ Time's up! Auto-ending question.");
                    handleEndQuestion();
                    return { ...prev, timeLeft: 0 };
                }
                
                return { ...prev, timeLeft: newTimeLeft };
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
        
    }, [quizState.status, quizState.timerActive, quizState.currentQuestion, 
        quizState.showingResult, handleEndQuestion]);

    // ✅ Result display timer
    useEffect(() => {
        if (resultTimerRef.current) {
            clearTimeout(resultTimerRef.current);
            resultTimerRef.current = null;
        }

        if (quizState.showingResult && questionResult) {
            console.log("📊 Showing results for 5 seconds...");
            
            resultTimerRef.current = setTimeout(() => {
                console.log("⏰ Result display time ended. Moving to next question.");
                setQuizState(prev => ({ ...prev, showingResult: false }));
                setQuestionResult(null);
                questionEndedRef.current = false;
                QuizWebSocketService.startNextQuestion();
            }, 5000);

            return () => {
                if (resultTimerRef.current) {
                    clearTimeout(resultTimerRef.current);
                    resultTimerRef.current = null;
                }
            };
        }
    }, [quizState.showingResult, questionResult]);

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

    // ✅ WebSocket connection với cleanup tốt hơn
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
                    setParticipants(prev => {
                        // Tránh duplicate
                        const exists = prev.find(p => p.participantId === data.participant.participantId);
                        if (exists) return prev;
                        return [...prev, data.participant];
                    });
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
                    questionEndedRef.current = false;
                    setQuizState(prev => ({
                        ...prev,
                        currentQuestion: data,
                        showingResult: false,
                        timerActive: true
                    }));
                    setQuestionResult(null);
                },
                onQuestionEnded: (data) => {
                    console.log('🏁 Question ended, received results:', data);
                    setQuestionResult(data);
                    setQuizState(prev => ({
                        ...prev,
                        showingResult: true,
                        timerActive: false
                    }));
                    
                    // ✅ Update participants với scores mới
                    if (data.results && Array.isArray(data.results)) {
                        setParticipants(prev => {
                            return prev.map(p => {
                                const result = data.results.find(r => r.participantId === p.participantId);
                                if (result) {
                                    return { ...p, currentScore: result.totalScore };
                                }
                                return p;
                            });
                        });
                    }
                },
                onQuizStarted: (data) => {
                    console.log('🎉 Quiz started broadcast received!', data);
                    setQuizState(prev => ({ ...prev, status: 'ACTIVE' }));
                },
                onQuizFinished: (data) => {
                    console.log('🏁 Quiz finished broadcast received!', data);
                    setQuizState(prev => ({
                        ...prev,
                        status: 'FINISHED',
                        timerActive: false,
                        currentQuestion: null
                    }));
                    
                    // ✅ Sắp xếp và lưu kết quả cuối
                    setParticipants(prev => {
                        const sorted = [...prev].sort((a, b) => b.currentScore - a.currentScore);
                        setFinalResults(sorted);
                        return sorted;
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
                                        {questionResult.results.map((result) => (
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
                        {/* ✅ Dùng finalResults thay vì oldParticipants */}
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
                                // ✅ Reset toàn bộ state
                                setSession(null);
                                setParticipants([]);
                                setQuizState({
                                    status: 'WAITING_FOR_PLAYERS',
                                    currentQuestion: null,
                                    timerActive: false,
                                    showingResult: false,
                                    timeLeft: 0
                                });
                                setFinalResults(null);
                                setQuestionResult(null);
                                questionEndedRef.current = false;
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
                        {quizState.showingResult && renderQuestionResult()}

                        {quizState.status === 'FINISHED' && finalResults ? (
                            renderFinalResults()
                        ) : (
                            <>
                                <div className="bg-white rounded-3xl shadow-xl p-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black text-gray-800 mb-2">
                                                📌 Session Active
                                                {quizState.status === 'FINISHED' && <span className="ml-2 text-red-600">(KẾT THÚC)</span>}
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

                                {quizState.currentQuestion && !quizState.showingResult && (
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-6 text-white">
                                        <h3 className="text-2xl font-black mb-4">❓ Câu Hỏi Hiện Tại</h3>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                            <p className="text-lg font-semibold mb-2">
                                                Câu {quizState.currentQuestion.questionNumber}/{session.totalQuestions}
                                            </p>
                                            <h4 className="text-2xl font-bold mb-4">
                                                {quizState.currentQuestion.question.content}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-black">
                                                    ⏱️ {quizState.timeLeft}s
                                                </div>
                                                <button 
                                                    onClick={handleEndQuestion}
                                                    disabled={quizState.showingResult}
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
                                            {/* ✅ Dùng participants và sắp xếp theo điểm */}
                                            {[...participants]
                                                .sort((a, b) => b.currentScore - a.currentScore)
                                                .map((participant, index) => (
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

                                {quizState.status === 'WAITING_FOR_PLAYERS' && (
                                    <button 
                                        onClick={handleStartQuiz}
                                        disabled={participants.length === 0 || !connected}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 rounded-3xl font-black text-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl"
                                    >
                                        {quizState.status === 'ACTIVE' ? 'Quiz Đang Chạy' : '🚀 Start Quiz'}
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