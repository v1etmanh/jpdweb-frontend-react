import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class QuizWebSocketService {
    constructor() {
        this.stompClient = null;
        this.sessionCode = null;
        this.callbacks = {
            onConnected: null,
            onParticipantJoined: null,
            onParticipantsList: null,
            onError: null,
            onQuizStarted: null, // Thêm callback này
            onQuizFinished: null, // <-- THÊM CALLBACK MỚI NÀY
            onQuestionStarted: null, // Thêm callback này (giả định cần)
            onQuestionResults: null ,
            onQuestionEnded: null, // ✨ THÊM CALLBACK NÀY
            onAnswerSubmitted: null, // ✨ THÊM CALLBACK NÀY
            onLeaderboard: null //
        };
    }

    connect(sessionCode, callbacks = {}) {
        this.sessionCode = sessionCode;
        this.callbacks = { ...this.callbacks, ...callbacks };

        const socket = new SockJS('http://localhost:9090/ws-quiz');
        this.stompClient = Stomp.over(socket);

        // Debug log
        this.stompClient.debug = (str) => {
            console.log('STOMP:', str);
        };

        return new Promise((resolve, reject) => {
            this.stompClient.connect(
                {},
                (frame) => {
                    console.log('✅ Connected:', frame);
                        this.stompClient.subscribe(
    `/topic/quiz/${sessionCode}`, // Đây là kênh mà Spring boot broadcast QUIZ_STARTED
    (message) => {
        const data = JSON.parse(message.body);
        
        // ... (xử lý các loại tin nhắn khác)
        
        // Xử lý sự kiện QUIZ_STARTED
        if (data.type === 'QUIZ_STARTED' && this.callbacks.onQuizStarted) {
            this.callbacks.onQuizStarted(data); // <-- GỌI CALLBACK NÀY
        }
    }
);                     this.stompClient.subscribe(
                        `/topic/quiz/${sessionCode}`,
                        (message) => {
                            const data = JSON.parse(message.body);
                            console.log('📨 Main topic received:', data.type);

                            // ✅ QUIZ_STARTED
                            if (data.type === 'QUIZ_STARTED' && this.callbacks.onQuizStarted) {
                                this.callbacks.onQuizStarted(data);
                            }
                            
                            // ✅ QUESTION_STARTED
                            if (data.type === 'QUESTION_STARTED' && this.callbacks.onQuestionStarted) {
                                this.callbacks.onQuestionStarted(data);
                            }
                            
                            // ✅ ANSWER_SUBMITTED (update counter)
                            if (data.type === 'ANSWER_SUBMITTED' && this.callbacks.onAnswerSubmitted) {
                                this.callbacks.onAnswerSubmitted(data);
                            }
                            
                            // ✅ QUESTION_ENDED (results)
                            if (data.type === 'QUESTION_ENDED' && this.callbacks.onQuestionEnded) {
                                this.callbacks.onQuestionEnded(data);
                            }
                            
                            // ✅ LEADERBOARD
                            if (data.type === 'LEADERBOARD' && this.callbacks.onLeaderboard) {
                                this.callbacks.onLeaderboard(data);
                            }
                            
                            // ✅ QUIZ_ENDED - ĐIỀU CHỈNH CHÍNH Ở ĐÂY!
                            if (data.type === 'QUIZ_ENDED' && this.callbacks.onQuizFinished) {
                                console.log('🏁 QUIZ_ENDED received from main topic!');
                                this.callbacks.onQuizFinished(data);
                            }
                            
                            // ERROR
                            if (data.type === 'ERROR') {
                                console.error('❌ Server error:', data.message);
                                alert('Quiz Error: ' + data.message);
                            }
                        }
                    );
                    // Subscribe để nhận participants updates
                    this.stompClient.subscribe(
                        `/topic/quiz/${sessionCode}/participants`,
                        (message) => {
                            const data = JSON.parse(message.body);
                            console.log('📨 Received:', data);

                            if (data.type === 'PARTICIPANT_JOINED' && this.callbacks.onParticipantJoined) {
                                this.callbacks.onParticipantJoined(data);
                            }

                            if (data.type === 'PARTICIPANTS_LIST' && this.callbacks.onParticipantsList) {
                                this.callbacks.onParticipantsList(data);
                            }
                            if (data.type === 'QUIZ_ENDED' && this.callbacks.onQuizFinished) {
                                console.log('🏁 QUIZ_ENDED received. Calling callback.');
                                this.callbacks.onQuizFinished(data); 
                            }
                        }
                    );

                    if (this.callbacks.onConnected) {
                        this.callbacks.onConnected();
                    }

                    resolve();
                },
                (error) => {
                    console.error('❌ Connection error:', error);
                    if (this.callbacks.onError) {
                        this.callbacks.onError(error);
                    }
                    reject(error);
                }
            );
        });
    }

    joinSession(participantName) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('❌ Not connected to WebSocket');
            return;
        }

        console.log('📤 Sending join request:', participantName);

        this.stompClient.send(
            `/app/quiz/join/${this.sessionCode}`,
            {},
            JSON.stringify({
                sessionCode: this.sessionCode,
                participantName: participantName
            })
        );
    }

    getParticipants() {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('❌ Not connected to WebSocket');
            return;
        }

        this.stompClient.send(`/app/quiz/${this.sessionCode}/get-participants`, {}, '{}');
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
            console.log('🔌 Disconnected');
        }
    }
    startQuiz() { // <-- PHƯƠNG THỨC MỚI CẦN THÊM
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('❌ Not connected to WebSocket. Cannot start quiz.');
            return;
        }
        if (!this.sessionCode) {
            console.error('❌ Session code is missing. Cannot start quiz.');
            return;
        }

        console.log(`📤 Sending start quiz request for session: ${this.sessionCode}`);

        // Endpoint: /app/quiz/{sessionCode}/start
        // Tên MessageMapping trong Spring là /quiz/{sessionCode}/start
        // Prefix /app là mặc định cho STOMP destination
        this.stompClient.send(
            `/app/quiz/${this.sessionCode}/start`,
            {},
            // Body có thể là rỗng hoặc {}
            '{}'
        );
    }
    startNextQuestion() { 
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('❌ Not connected to WebSocket. Cannot start next question.');
            return;
        }
        if (!this.sessionCode) {
            console.error('❌ Session code is missing. Cannot start next question.');
            return;
        }

        console.log(`📤 Sending start next question request for session: ${this.sessionCode}`);

        // Endpoint: /app/quiz/{sessionCode}/next-question
        this.stompClient.send(
            `/app/quiz/${this.sessionCode}/next-question`,
            {},
            '{}' // Body rỗng
        );
    }
    endQuestion() {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('❌ Not connected to WebSocket. Cannot end question.');
            return;
        }
        if (!this.sessionCode) {
            console.error('❌ Session code is missing. Cannot end question.');
            return;
        }

        console.log(`🏁 Sending end question request for session: ${this.sessionCode}`);

        // Endpoint: /app/quiz/{sessionCode}/end-question
        this.stompClient.send(
            `/app/quiz/${this.sessionCode}/end-question`,
            {},
            '{}' // Body rỗng
        );
    }
}

export default new QuizWebSocketService();