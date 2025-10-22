import { useEffect, useState } from "react";
import { aiApi } from "./api/aiApi";
import { FileDown, BookOpen, X, Loader2 } from "lucide-react";

export default function WritingComponent({ data, onComplete }) {
  const [writingMock, setWritingMock] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    setWritingMock(data);
  }, [data]);

  const handleSubmit = async () => {
    if (!answer || answer.trim() === "") {
      alert("Vui lòng nhập câu trả lời trước khi nộp bài.");
      return;
    }

    console.log("Submitting answer:", answer); // Debug log

    setIsEvaluating(true);
    try {
      const payload = {
        writingText: answer.trim(),
        language:  "ENGLISH"
      };
      
      console.log("Payload:", payload); // Debug log

      const response = await aiApi.evaluateWriting(payload);

      console.log("API Response:", response); // Debug log

      // Xử lý cả 2 format response
      const result = response.data;
      const normalizedResult = {
        grammarScore: result.grammarScore || result.grammar || 0,
        vocabularyScore: result.vocabularyScore || result.vocabulary || 0,
        feedback: result.feedback || "Không có nhận xét"
      };

      console.log("Normalized result:", normalizedResult); // Debug log

      setEvaluationResult(normalizedResult);
    } catch (error) {
      console.error("Lỗi khi chấm điểm:", error);
      console.error("Error details:", error.response?.data); // Debug log
      alert("Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const downloadReport = () => {
    if (!evaluationResult) return;

    const reportContent = `
=================================================
            BÁO CÁO ĐÁNH GIÁ BÀI VIẾT
=================================================

📊 ĐIỂM SỐ:
-------------------------------------------------
• Ngữ pháp (Grammar):     ${evaluationResult.grammarScore.toFixed(1)}/10
• Từ vựng (Vocabulary):   ${evaluationResult.vocabularyScore.toFixed(1)}/10
• Điểm trung bình:        ${((evaluationResult.grammarScore + evaluationResult.vocabularyScore) / 2).toFixed(1)}/10

📝 NHẬN XÉT CHI TIẾT:
-------------------------------------------------
${evaluationResult.feedback}

✍️ BÀI VIẾT CỦA BẠN:
-------------------------------------------------
${answer}

=================================================
Ngày tạo: ${new Date().toLocaleString('vi-VN')}
=================================================
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Writing_Report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectTemplate = (template) => {
    setAnswer(template);
    setShowTemplates(false);
  };

  if (!writingMock) return <div className="min-h-screen bg-[#243864] flex items-center justify-center text-white">Đang tải...</div>;

  return (
    <div className="min-h-screen w-full bg-[#243864] text-white flex flex-col md:flex-row relative">
      {/* LEFT COLUMN */}
      <div className="md:w-1/2 w-full flex flex-col p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e88e5] mb-6">
          Writing Task
        </h1>

        {writingMock.img && (
          <img
            src={writingMock.img}
            alt="writing-question"
            className="w-full h-auto rounded-xl mb-6 border-4 border-[#1e88e5]"
          />
        )}

        <p className="bg-white text-[#243864] p-5 rounded-lg text-lg leading-relaxed">
          {writingMock.question}
        </p>

        {/* Templates Button */}
        {writingMock.templates && writingMock.templates.length > 0 && (
          <button
            onClick={() => setShowTemplates(true)}
            className="mt-6 bg-[#00897b] hover:bg-[#00695c] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2 justify-center"
          >
            <BookOpen size={20} />
            Xem bài viết mẫu ({writingMock.templates.length})
          </button>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:w-1/2 w-full flex flex-col p-6 md:p-10 bg-white text-[#243864]">
        <h2 className="text-2xl font-semibold mb-4">Câu trả lời của bạn</h2>
        
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Nhập câu trả lời của bạn ở đây..."
          className="w-full flex-grow min-h-[300px] p-5 border-2 border-[#243864] rounded-lg text-lg focus:outline-none focus:border-[#1e88e5] focus:ring-4 focus:ring-[#1e88e5]/30 transition-all resize-none"
          disabled={isEvaluating}
        />

        {/* Evaluation Result */}
        {evaluationResult && (
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-[#1e88e5]">
            <h3 className="text-xl font-bold mb-4 text-[#1e88e5]">🎯 Kết quả đánh giá</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Ngữ pháp</p>
                <p className="text-2xl font-bold text-[#1e88e5]">
                  {evaluationResult.grammarScore.toFixed(1)}/10
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Từ vựng</p>
                <p className="text-2xl font-bold text-[#1e88e5]">
                  {evaluationResult.vocabularyScore.toFixed(1)}/10
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <p className="text-sm text-gray-600 mb-2">Nhận xét:</p>
              <p className="text-base leading-relaxed">{evaluationResult.feedback}</p>
            </div>

            <button
              onClick={downloadReport}
              className="w-full bg-[#00897b] hover:bg-[#00695c] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2 justify-center"
            >
              <FileDown size={20} />
              Tải báo cáo về máy
            </button>
          </div>
        )}

        <div className="pt-6 text-right">
          <button
            onClick={handleSubmit}
            disabled={isEvaluating || !answer.trim()}
            className="bg-[#1e88e5] hover:bg-[#1565c0] text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 ml-auto"
          >
            {isEvaluating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Đang chấm điểm...
              </>
            ) : (
              "Nộp bài"
            )}
          </button>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-[#243864] text-white">
              <h3 className="text-2xl font-bold">📚 Bài viết mẫu</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              {writingMock.templates.map((template, index) => (
                <div
                  key={index}
                  className="mb-4 p-5 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-[#1e88e5] transition-all cursor-pointer"
                  onClick={() => selectTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[#243864]">
                      Mẫu {index + 1}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTemplate(template);
                      }}
                      className="bg-[#1e88e5] hover:bg-[#1565c0] text-white text-sm py-1 px-3 rounded transition-all"
                    >
                      Chọn
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {template}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}