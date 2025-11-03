import { useCallback, useEffect, useState } from 'react';
import ReadPractice from './PassageSpeaking';
import SpeakingPictureQuestion from './SpeakingWithPictureComponent';
import { useSearchParams } from 'react-router-dom';

export default function SpeakingPage({ paragraphs, pictureAndQuestions, isSave, postP, language }) {
  const [selectedPara, setSelectedPara] = useState(null);
  const [selectedPic, setSelectedPic] = useState(null);
  const [disPlay1, setDisplay1] = useState(false);
  const [disPlay2, setDisplay2] = useState(false);
  const [isDone, setIsDone] = useState(true);
  
  // Track completed items by their index
  const [completedParas, setCompletedParas] = useState([]);
  const [completedPics, setCompletedPics] = useState([]);

  // Determine which mode we're in
  const hasParagraphs = paragraphs && paragraphs.length > 0;
  const hasPictures = pictureAndQuestions && pictureAndQuestions.length > 0;
  // Calculate required minimums (at least half)
  const requiredParas = hasParagraphs ? Math.ceil(paragraphs.length / 2) : 0;
  const requiredPics = hasPictures ? Math.ceil(pictureAndQuestions.length / 2) : 0;
 
  // Reset isDone when isSave prop changes
useEffect(() => {
  if (!isSave) {
    // bắt đầu session mới
    setIsDone(false);
    setCompletedParas([]);
    setCompletedPics([]);
  } else {
    // save → chỉ set isDone = true, không reset completed
    setIsDone(true);
  }
}, [isSave]);

  // Calculate if we've completed the required minimums
  const meetsRequirements = 
    (hasParagraphs ? completedParas.length >= requiredParas : true) && 
    (hasPictures ? completedPics.length >= requiredPics : true);

  // Check if requirements are met and post result
  useEffect(() => {
    if (!isDone && meetsRequirements) {
      console.log(`Requirements met, posting results...`);
      postP();
      setIsDone(true);
    }
  }, [isDone, completedParas.length, completedPics.length, requiredParas, requiredPics, postP, meetsRequirements]);

  // Callbacks for marking tasks as completed
  const completeReadPractice = useCallback(() => {
    if (!isDone && selectedPara !== null && !completedParas.includes(selectedPara)) {
      console.log(`Paragraph ${selectedPara} completed`);
      setCompletedParas(prev => [...prev, selectedPara]);
    }
  }, [isDone, selectedPara, completedParas]);

  const completeSpeakingPicture = useCallback(() => {
    if (!isDone && selectedPic !== null && !completedPics.includes(selectedPic)) {
      console.log(`Picture ${selectedPic} completed`);
      setCompletedPics(prev => [...prev, selectedPic]);
    }
  }, [isDone, selectedPic, completedPics]);

  return (
    <div className="speaking-page-container bg-background min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card p-6 shadow-card rounded-2xl bg-surface animate-fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
            <span className="mr-3 text-primary-30"></span>
            Bài Tập Nói
          </h2>
          
          {/* Show paragraph selector only if paragraphs exist */}
          {hasParagraphs && (
            <div className="mb-6">
              <label htmlFor="selPara" className="form-label fw-bold text-text-primary block mb-2 font-medium">
                <span className="flex items-center">
                  <span className="mr-2 text-primary-30">📝</span>
                  Chọn đoạn văn
                </span>
              </label>
              <select
                id="selPara"
                className="form-select w-full p-3 border border-border-main rounded-xl bg-surface text-text-primary focus:ring-2 focus:ring-primary-30 focus:border-primary-30 transition-all duration-200 shadow-soft"
                onChange={e => {
                  setSelectedPara(Number(e.target.value));
                  setDisplay1(true);
                  setDisplay2(false);
                }}
                defaultValue=""
              >
                <option value="" disabled>-- Chọn đoạn --</option>
                {paragraphs.map((_, idx) => (
                  <option key={idx} value={idx} className="flex justify-between">
                    Đoạn {idx + 1} {completedParas.includes(idx) && <span className="text-status-completed">✓</span>}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show picture selector only if pictures exist */}
          {hasPictures && (
            <div>
              <label htmlFor="selPic" className="form-label fw-bold text-text-primary block mb-2 font-medium">
                <span className="flex items-center">
                  <span className="mr-2 text-primary-30"></span>
                  Chọn hình & câu hỏi
                </span>
              </label>
              <select
                id="selPic"
                className="form-select w-full p-3 border border-border-main rounded-xl bg-surface text-text-primary focus:ring-2 focus:ring-primary-30 focus:border-primary-30 transition-all duration-200 shadow-soft"
                onChange={e => {
                  setSelectedPic(Number(e.target.value));
                  setDisplay1(false);
                  setDisplay2(true);
                }}
                defaultValue=""
              >
                <option value="" disabled>-- Chọn hình --</option>
                {pictureAndQuestions.map((_, idx) => (
                  <option key={idx} value={idx}>
                    Hình {idx + 1} {completedPics.includes(idx) && <span className="text-status-completed">✓</span>}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Task completion status indicator */}
        {!isDone && (
          <div className="mt-6 p-4 bg-surface border border-border-light rounded-2xl shadow-soft animate-slide-up">
            <div className="fw-bold mb-3 text-text-primary text-lg flex items-center">
              <span className="mr-2 text-primary-30"></span>
              Tiến độ hoàn thành
            </div>
            
            <div className="space-y-3">
              {hasParagraphs && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Đoạn văn:</span>
                  <div className="flex items-center">
                    <span className={`font-medium ${completedParas.length >= requiredParas ? 'text-status-completed' : 'text-status-required'}`}>
                      {completedParas.length}/{requiredParas}
                    </span>
                    <div className="ml-3 w-24 h-2 bg-border-light rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          completedParas.length >= requiredParas ? 'bg-status-completed' : 'bg-status-required'
                        }`}
                        style={{ width: `${Math.min(100, (completedParas.length / requiredParas) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {hasPictures && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Hình ảnh:</span>
                  <div className="flex items-center">
                    <span className={`font-medium ${completedPics.length >= requiredPics ? 'text-status-completed' : 'text-status-required'}`}>
                      {completedPics.length}/{requiredPics}
                    </span>
                    <div className="ml-3 w-24 h-2 bg-border-light rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          completedPics.length >= requiredPics ? 'bg-status-completed' : 'bg-status-required'
                        }`}
                        style={{ width: `${Math.min(100, (completedPics.length / requiredPics) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {meetsRequirements && (
              <div className="mt-4 p-3 bg-status-completed/10 border border-status-completed/30 rounded-xl text-status-completed font-medium flex items-center animate-pulse-soft">
                <span className="mr-2">✅</span>
                Đã đủ điều kiện! Dữ liệu sẽ được lưu sớm.
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          {disPlay1 && selectedPara != null && hasParagraphs && (
            <div className="animate-scale-in">
              {completedParas.includes(selectedPara) ? (
                <div className="alert p-4 bg-status-completed/10 border border-status-completed/30 rounded-2xl text-status-completed flex items-center shadow-soft">
                  <span className="mr-2 text-lg">✓</span>
                  Bạn đã hoàn thành đoạn văn này! Chọn đoạn khác để tiếp tục luyện tập.
                </div>
              ) : (
                <ReadPractice 
                  paragraph={paragraphs[selectedPara].passage} 
                  increNum={completeReadPractice} 
                  language={language}
                />
              )}
            </div>
          )}

          {disPlay2 && selectedPic != null && hasPictures && (
            <div className="animate-scale-in">
              {completedPics.includes(selectedPic) ? (
                <div className="alert p-4 bg-status-completed/10 border border-status-completed/30 rounded-2xl text-status-completed flex items-center shadow-soft">
                  <span className="mr-2 text-lg">✓</span>
                  Bạn đã hoàn thành phần hình ảnh này! Chọn hình khác để tiếp tục luyện tập.
                </div>
              ) : (
                <SpeakingPictureQuestion
                  imageUrl={pictureAndQuestions[selectedPic].pictureUrl}
                  questions={pictureAndQuestions[selectedPic].speakingPictureListQuestions}
                  increNum={completeSpeakingPicture}
                  language={language}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for additional styling */}
      <style jsx>{`
        .speaking-page-container {
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .form-select option {
          display: flex;
          justify-content: space-between;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(15px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}