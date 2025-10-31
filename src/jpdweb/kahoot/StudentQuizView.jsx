import { useEffect, useState } from "react";
import KahootMutiplechoice from "./KahootMutipleChoice";
import KahootGapfill from "./KahootGapfill";
import QuizWebSocketService from "../../hooks/QuizWebSocketService";

export default function StudentQuizView({ sessionCode, participantId }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [questionResult, setQuestionResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

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
                    setShowResult(false);
                    break;

                case "ANSWER_SUBMITTED":
                    console.log(`📊 Progress: ${data.totalAnswered}/${data.totalParticipants}`);
                    break;

                case "QUESTION_ENDED":
                    console.log("🏁 Question ended, showing results");
                    setQuestionResult(data);
                    setShowResult(true);
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

    const renderStudentResult = () => {
        if (!questionResult || !showResult) return null;

        const myResult = questionResult.results.find(r => r.participantId === participantId);
        const isCorrect = myResult?.correct;

        return (
            <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="max-w-2xl w-full">
                    {/* Result Status Card */}
                    <div className={`rounded-3xl p-8 mb-6 text-white text-center transform transition-all duration-500 ${
                        isCorrect 
                            ? 'bg-gradient-to-br from-green-400 to-green-600 animate-bounce-in' 
                            : 'bg-gradient-to-br from-red-400 to-red-600 animate-shake'
                    }`}>
                        <div className="text-8xl mb-4 animate-scale-in">
                            {isCorrect ? '🎉' : '😔'}
                        </div>
                        <h2 className="text-5xl font-black mb-4">
                            {isCorrect ? 'Chính Xác!' : 'Chưa Đúng'}
                        </h2>
                        <div className="text-6xl font-black">
                            +{myResult?.points || 0}
                        </div>
                        <p className="text-2xl font-semibold mt-2 opacity-90">điểm</p>
                    </div>

                    {/* Correct Answer Display */}
                    <div className="bg-white rounded-3xl p-6 mb-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-2xl">✅</span>
                            Đáp án đúng:
                        </h3>
                        <p className="text-2xl font-black text-purple-600 bg-purple-50 rounded-xl p-4">
                            {questionResult.correctAnswer}
                        </p>
                    </div>

                    {/* Student Stats */}
                    {myResult && (
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-600 mb-1">
                                        Câu trả lời của bạn:
                                    </p>
                                    <p className="text-xl font-black text-blue-600">
                                        {myResult.answer}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-600 mb-1">
                                        Tổng điểm:
                                    </p>
                                    <p className="text-xl font-black text-yellow-600 flex items-center gap-1">
                                        🏆 {myResult.totalScore}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Next Question Notice */}
                    <div className="text-center mt-6 text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 animate-pulse">
                            <span className="text-2xl">⏰</span>
                            <span className="font-semibold text-lg">
                                Đang chờ câu hỏi tiếp theo...
                            </span>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes bounce-in {
                        0% { transform: scale(0.3); opacity: 0; }
                        50% { transform: scale(1.05); }
                        70% { transform: scale(0.9); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                        20%, 40%, 60%, 80% { transform: translateX(10px); }
                    }
                    
                    @keyframes scale-in {
                        from { transform: scale(0); }
                        to { transform: scale(1); }
                    }
                    
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                    
                    .animate-bounce-in {
                        animation: bounce-in 0.6s ease-out;
                    }
                    
                    .animate-shake {
                        animation: shake 0.6s ease-out;
                    }
                    
                    .animate-scale-in {
                        animation: scale-in 0.5s ease-out;
                    }
                `}</style>
            </div>
        );
    };

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-8xl mb-6 animate-bounce">⏳</div>
                    <h2 className="text-4xl font-black text-white mb-4">
                        Waiting for question...
                    </h2>
                    <p className="text-xl text-white/80 font-semibold">
                        The teacher will start the quiz soon
                    </p>
                </div>
            </div>
        );
    }

    const questionData = currentQuestion.question;
    const typeOfContent = questionData.typeOfContent;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
            {showResult && renderStudentResult()}

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