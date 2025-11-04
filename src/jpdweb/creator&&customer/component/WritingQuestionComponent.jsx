import { useEffect, useState } from "react";
import { aiApi } from "../../api/system/aiApi";
import { FileDown, BookOpen, X, Loader2 } from "lucide-react";

export default function WritingQuestionComponent({ data, onComplete }) {
  const [writingMock, setWritingMock] = useState(null);
  const [answer, setAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    setWritingMock(data);
  }, [data]);

  useEffect(() => {
    // Count words
    const words = answer.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [answer]);

  const handleSubmit = async () => {
    if (!answer || answer.trim() === "") {
      alert("Vui lòng nhập câu trả lời trước khi nộp bài.");
      return;
    }

    if (wordCount < 250) {
      alert("Bài viết của bạn cần ít nhất 250 từ.");
      return;
    }

    setIsEvaluating(true);
    try {
      const payload = {
        writingText: answer.trim(),
        language: "ENGLISH"
      };

      const response = await aiApi.evaluateWriting(payload);
      const result = response.data;
      const normalizedResult = {
        grammarScore: result.grammarScore || result.grammar || 0,
        vocabularyScore: result.vocabularyScore || result.vocabulary || 0,
        feedback: result.feedback || "Không có nhận xét"
      };

      setEvaluationResult(normalizedResult);
    } catch (error) {
      console.error("Lỗi khi chấm điểm:", error);
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
- Ngữ pháp (Grammar):     ${evaluationResult.grammarScore.toFixed(1)}/10
- Từ vựng (Vocabulary):   ${evaluationResult.vocabularyScore.toFixed(1)}/10
- Điểm trung bình:        ${((evaluationResult.grammarScore + evaluationResult.vocabularyScore) / 2).toFixed(1)}/10

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

  if (!writingMock) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* LEFT COLUMN - Question */}
      <div className="w-1/2 bg-white p-10 overflow-y-auto border-r border-gray-200">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">?</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Writing Task 2
            </h1>
          </div>

          {/* Image if available */}
          {writingMock.img && (
            <img
              src={writingMock.img}
              alt="writing-question"
              className="w-full h-auto rounded-lg mb-6 border border-gray-200"
            />
          )}

          {/* Question Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
              {writingMock.question}
            </p>
          </div>

          {/* Templates Button */}
          {writingMock.templates && writingMock.templates.length > 0 && (
            <button
              onClick={() => setShowTemplates(true)}
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <BookOpen size={20} />
              Xem bài viết mẫu ({writingMock.templates.length})
            </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - Answer Area */}
      <div className="w-1/2 bg-gray-50 p-10 overflow-y-auto flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Header with word count */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
            <div className="text-sm text-gray-600">
              <span className={`font-semibold ${wordCount < 250 ? 'text-red-600' : 'text-green-600'}`}>
                {wordCount}
              </span>
              <span className="text-gray-400">/5 - </span>
              <span className="font-semibold">250 từ</span>
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Nhập bài viết của bạn"
              className="w-full h-full min-h-[400px] p-4 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none bg-white"
              disabled={isEvaluating}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSubmit}
              disabled={isEvaluating || !answer.trim() || wordCount < 250}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
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

          {/* Evaluation Result */}
          {evaluationResult && (
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
                🎯 Kết quả đánh giá
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium">Ngữ pháp</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {evaluationResult.grammarScore.toFixed(1)}<span className="text-lg text-gray-500">/10</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 font-medium">Từ vựng</p>
                  <p className="text-3xl font-bold text-green-600">
                    {evaluationResult.vocabularyScore.toFixed(1)}<span className="text-lg text-gray-500">/10</span>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 mb-4">
                <p className="text-sm text-gray-700 font-medium mb-2">Điểm trung bình:</p>
                <p className="text-3xl font-bold text-purple-600">
                  {((evaluationResult.grammarScore + evaluationResult.vocabularyScore) / 2).toFixed(1)}
                  <span className="text-lg text-gray-500">/10</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-700 font-semibold mb-2">💬 Nhận xét:</p>
                <p className="text-base text-gray-800 leading-relaxed">{evaluationResult.feedback}</p>
              </div>

              <button
                onClick={downloadReport}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2 justify-center"
              >
                <FileDown size={20} />
                Tải báo cáo về máy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen size={28} />
                Bài viết mẫu
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 bg-gray-50">
              {writingMock.templates.map((template, index) => (
                <div
                  key={index}
                  className="mb-4 p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => selectTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      📝 Mẫu {index + 1}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTemplate(template);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-lg transition-all"
                    >
                      Chọn mẫu này
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