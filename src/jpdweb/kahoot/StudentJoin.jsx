import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './StudentJoin.css';
import QuizWebSocketService from '../../hooks/QuizWebSocketService';
import StudentQuizView from './StudentQuizView';


function StudentJoin() {
    const [sessionCode, setSessionCode] = useState('');
    const [participantName, setParticipantName] = useState('');
    const [joined, setJoined] = useState(false);
    const [session, setSession] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
const [quizStarted, setQuizStarted] = useState(false); // <-- Theo dõi trạng thái quiz đã bắt đầu
    useEffect(() => {
        return () => {
            QuizWebSocketService.disconnect();
        };
    }, []);

    const joinSession = async () => {
        if (!sessionCode || !participantName) {
            setError('Please enter session code and your name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Validate session via REST API
            const response = await axios.post('http://localhost:9090/api/quiz/join', {
                sessionCode: sessionCode.toUpperCase(),
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

            // 2. Connect WebSocket
            await QuizWebSocketService.connect(sessionCode.toUpperCase(), {
                onQuizStarted: (data) => {
                    console.log('🎉 Quiz started! Data:', data);
                    setQuizStarted(true); // <-- Cập nhật state để chuyển view
                },onConnected: () => {
                    console.log('✅ Connected to WebSocket');
                },
                onError: (err) => {
                    console.error('❌ WebSocket error:', err);
                }
            });

            console.log('✅ Successfully joined session');

        } catch (error) {
            console.error('❌ Error joining session:', error);
            setError(error.response?.data?.message || 'Failed to join session');
        } finally {
            setLoading(false);
        }
    };
if (quizStarted && session && participant) {
        // RENDER STUDENT QUIZ VIEW NẾU QUIZ ĐÃ BẮT ĐẦU
        return (
            <StudentQuizView 
                sessionCode={session.sessionCode} 
                participantId={participant.participantId} 
                // Có thể truyền thêm STOMP client nếu cần
            />
        );
    }
    return (
        <div className="student-join">
            {!joined ? (
                <div className="join-form">
                    <h1>🎮 Join Quiz</h1>
                    
                    <div className="form-group">
                        <label>Session Code:</label>
                        <input
                            type="text"
                            value={sessionCode}
                            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                            placeholder="Enter PIN"
                            maxLength={6}
                            className="code-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Name:</label>
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <button onClick={joinSession} disabled={loading}>
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
                        <p>Waiting for the quiz to start...</p>
                        <p className="hint">The teacher will start the quiz soon!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentJoin;