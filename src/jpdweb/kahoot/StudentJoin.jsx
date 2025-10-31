import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentJoin.css';
import QuizWebSocketService from '../../hooks/QuizWebSocketService';
import StudentQuizView from './StudentQuizView';
import { useParams } from 'react-router-dom';

function StudentJoin() {
    const { id } = useParams(); // ✅ Lấy sessionCode từ URL
    const [participantName, setParticipantName] = useState('');
    const [joined, setJoined] = useState(false);
    const [session, setSession] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        return () => {
            QuizWebSocketService.disconnect();
        };
    }, []);

    const joinSession = async () => {
        if (!participantName || !id) { // ✅ Kiểm tra id từ params
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const upperSessionCode = id.toUpperCase(); // ✅ Dùng id từ useParams
            console.log('🔵 Joining session:', upperSessionCode);

            // 1. Validate session via REST API
            const response = await axios.post('http://localhost:9090/api/quiz/join', {
                sessionCode: upperSessionCode,
                participantName: participantName
            });

            if (!response.data.success) {
                setError(response.data.message);
                setLoading(false);
                return;
            }

            setSession(response.data.session);
            setParticipant(response.data.participant);
            setJoined(true);

            // 2. Connect WebSocket với ĐÚNG sessionCode
            await QuizWebSocketService.connect(upperSessionCode, { // ✅ Dùng upperSessionCode
                onConnected: () => {
                    console.log('✅ WebSocket connected to session:', upperSessionCode);
                },
                onQuizStarted: (data) => {
                    console.log('🎉 Quiz started! Data:', data);
                    setQuizStarted(true);
                },
                onQuestionStarted: (data) => { // ✅ QUAN TRỌNG - Lắng nghe QUESTION_STARTED
                    console.log('📝 Question started:', data);
                    setQuizStarted(true); // Chuyển sang QuizView
                },
                onError: (err) => {
                    console.error('❌ WebSocket error:', err);
                    setError('WebSocket connection failed');
                }
            });

            console.log('✅ Successfully joined session and connected WebSocket');

        } catch (error) {
            console.error('❌ Error joining session:', error);
            setError(error.response?.data?.message || 'Failed to join session');
        } finally {
            setLoading(false);
        }
    };

    if (quizStarted && session && participant) {
        return (
            <StudentQuizView 
                sessionCode={session.sessionCode} 
                participantId={participant.participantId} 
            />
        );
    }

    return (
        <div className="student-join">
            {!joined ? (
                <div className="join-form">
                    <h1>🎮 Join Quiz</h1>
                    
                    {/* Hiển thị session code từ URL */}
                    <div className="session-display">
                        <p>Session Code: <strong>{id}</strong></p>
                    </div>

                    <div className="form-group">
                        <label>Your Name:</label>
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                            onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                        />
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <button onClick={joinSession} disabled={loading || !participantName}>
                        {loading ? 'Joining...' : 'Join Session'}
                    </button>
                </div>
            ) : (
                <div className="waiting-room">
                    <h1>✅ Successfully Joined!</h1>
                    
                    <div className="session-info">
                        <h2>{session.title}</h2>
                        <p className="session-code">Session: {session.sessionCode}</p>
                    </div>

                    <div className="participant-info">
                        <div className="avatar">👤</div>
                        <h3>{participant.name}</h3>
                        <p className="participant-id">ID: {participant.participantId.substring(0, 8)}...</p>
                    </div>

                    <div className="waiting-message">
                        <div className="spinner"></div>
                        <p>🔌 Connected to WebSocket</p>
                        <p>⏳ Waiting for the quiz to start...</p>
                        <p className="hint">The teacher will start the quiz soon!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentJoin;