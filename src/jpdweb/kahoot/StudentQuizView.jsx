import { useEffect, useState } from "react";
import KahootMutiplechoice from "./KahootMutipleChoice";
import KahootGapfill from "./KahootGapfill";
import QuizWebSocketService from "../../hooks/QuizWebSocketService";

export default function StudentQuizView({ sessionCode, participantId }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [questionResult, setQuestionResult] = useState(null);
    const [showResult, setShowResult] = useState(false); // ✨ THÊM STATE

    useEffect(() => {
        const client = QuizWebSocketService.stompClient;

        if (!client || !client.connected) {
            console.error("❌ WebSocket client not connected when rendering QuizView. Attempting to reconnect...");
            return;
        }

        const subscription = client.subscribe(`/topic/quiz/${sessionCode}`, (message) => {
            const data = JSON.parse(message.body);
            console.log(data);
            
            switch (data.type) {
                case "QUESTION_STARTED":
                    console.log("📤 New question received");
                    setCurrentQuestion(data);
                    setIsAnswerSubmitted(false);
                    setQuestionResult(null);
                    setShowResult(false); // ✨ Reset trạng thái
                    break;

                case "ANSWER_SUBMITTED":
                    console.log(`📊 Progress: ${data.totalAnswered}/${data.totalParticipants}`);
                    break;

                case "QUESTION_ENDED":
                    console.log("🏁 Question ended, showing results");
                    setQuestionResult(data);
                    setShowResult(true); // ✨ Hiển thị kết quả
                    break;

                case "LEADERBOARD":
                    console.log("📊 Leaderboard updated");
                    break;

                default:
                    break;
            }
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log("🔌 Unsubscribed from quiz topic.");
            }
        };
    }, [sessionCode]);

    const handleSubmitAnswer = async (answerData) => {
        const client = QuizWebSocketService.stompClient;
        
        if (!client || !client.connected) {
            throw new Error("WebSocket not connected");
        }

        client.send(
            `/app/quiz/${sessionCode}/submit-answer`,
            {},
            JSON.stringify({ ...answerData, participantId })
        );

        setIsAnswerSubmitted(true);
    };

    // ✨ HÀM RENDER KẾT QUẢ CHO STUDENT
    const renderStudentResult = () => {
        if (!questionResult || !showResult) return null;

        // Tìm kết quả của học sinh này
        const myResult = questionResult.results.find(r => r.participantId === participantId);

        return (
            <div className="student-result-overlay">
                <div className="student-result-container">
                    <div className={`result-status ${myResult?.correct ? 'correct' : 'incorrect'}`}>
                        {myResult?.correct ? (
                            <>
                                <div className="result-icon">✅</div>
                                <h2>Chính Xác!</h2>
                                <p className="points-earned">+{myResult.points} điểm</p>
                            </>
                        ) : (
                            <>
                                <div className="result-icon">❌</div>
                                <h2>Chưa Đúng</h2>
                                <p className="points-earned">+0 điểm</p>
                            </>
                        )}
                    </div>

                    <div className="correct-answer-display">
                        <h3>Đáp án đúng:</h3>
                        <p className="correct-answer">{questionResult.correctAnswer}</p>
                    </div>

                    {myResult && (
                        <div className="student-stats">
                            <div className="stat-item">
                                <span className="stat-label">Câu trả lời của bạn:</span>
                                <span className="stat-value">{myResult.answer}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Tổng điểm hiện tại:</span>
                                <span className="stat-value total-score">🏆 {myResult.totalScore}</span>
                            </div>
                        </div>
                    )}

                    <p className="next-question-notice">
                        ⏰ Đang chờ câu hỏi tiếp theo...
                    </p>
                </div>
            </div>
        );
    };

    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="text-2xl font-bold mb-2">⏳ Waiting for question...</div>
                    <div className="text-gray-600">The teacher will start the quiz soon</div>
                </div>
            </div>
        );
    }

    const questionData = currentQuestion.question;
    const typeOfContent = questionData.typeOfContent;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
            {/* ✨ HIỂN THỊ KẾT QUẢ */}
            {showResult && renderStudentResult()}

            {/* HIỂN THỊ CÂU HỎI */}
            {!showResult && (
                typeOfContent === "MULTIPLE_CHOICE" ? (
                    <KahootMutiplechoice
                        mulptipleQuizz={questionData}
                        sessionCode={sessionCode}
                        participantId={participantId}
                        onSubmitAnswer={handleSubmitAnswer}
                        isAnswerSubmitted={isAnswerSubmitted}
                        questionResult={questionResult}
                    />
                ) : typeOfContent === "GAPFILL" ? (
                    <KahootGapfill
                        questionData={questionData}
                        sessionCode={sessionCode}
                        participantId={participantId}
                        onSubmitAnswer={handleSubmitAnswer}
                        isAnswerSubmitted={isAnswerSubmitted}
                        questionResult={questionResult}
                    />
                ) : null
            )}
        </div>
    );
}