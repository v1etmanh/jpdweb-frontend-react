import { useCallback, useEffect, useState } from 'react';
import ReadPractice from './PassageSpeaking';
import SpeakingPictureQuestion from './SpeakingWithPictureComponent';
// import ReadPractice from './SpeakingPassageForm';
// import SpeakingPictureQuestion from './SpeakingPictureForm';

export default function SpeakingPage({ paragraphs, pictureAndQuestions, isSave, postP }) {
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
    setIsDone(isSave);
    if (!isSave) {
      // When starting a new session, reset completion tracking
      setCompletedParas([]);
      setCompletedPics([]);
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
    <div className="container mt-4">
      <div className="card p-3 shadow-sm">
        {/* Show paragraph selector only if paragraphs exist */}
        {hasParagraphs && (
          <>
            <label htmlFor="selPara" className="form-label fw-bold">Chọn đoạn văn</label>
            <select
              id="selPara"
              className="form-select mb-3"
              onChange={e => {
                setSelectedPara(Number(e.target.value));
                setDisplay1(true);
                setDisplay2(false);
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Chọn đoạn --</option>
              {paragraphs.map((_, idx) => (
                <option key={idx} value={idx}>
                  Đoạn {idx + 1} {completedParas.includes(idx) ? "✓" : ""}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Show picture selector only if pictures exist */}
        {hasPictures && (
          <>
            <label htmlFor="selPic" className="form-label fw-bold">Chọn hình & câu hỏi</label>
            <select
              id="selPic"
              className="form-select"
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
                  Hình {idx + 1} {completedPics.includes(idx) ? "✓" : ""}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Task completion status indicator */}
      {!isDone && (
        <div className="mt-3 p-2 bg-light border rounded">
          <div className="fw-bold mb-2">Tiến độ:</div>
          {hasParagraphs && (
            <div>Đã hoàn thành {completedParas.length}/{requiredParas} đoạn văn cần thiết</div>
          )}
          {hasPictures && (
            <div>Đã hoàn thành {completedPics.length}/{requiredPics} hình cần thiết</div>
          )}
          {meetsRequirements && (
            <div className="mt-2 text-success fw-bold">
              Đã đủ điều kiện! ✅ Dữ liệu sẽ được lưu sớm.
            </div>
          )}
        </div>
      )}

      <div className="mt-5">
        {disPlay1 && selectedPara != null && hasParagraphs && (
          <>
            {completedParas.includes(selectedPara) ? (
              <div className="alert alert-success">
                Bạn đã hoàn thành đoạn văn này! Chọn đoạn khác.
              </div>
            ) : (
              <ReadPractice 
                paragraph={paragraphs[selectedPara].passageText} 
                increNum={completeReadPractice} 
                evaluateAnswerSpeaking={()=>{}}
              />
            )}
          </>
        )}

        {disPlay2 && selectedPic != null && hasPictures && (
          <>
            {completedPics.includes(selectedPic) ? (
              <div className="alert alert-success">
                Bạn đã hoàn thành phần hình ảnh này! Chọn hình khác.
              </div>
            ) : (
              <SpeakingPictureQuestion
                imageUrl={pictureAndQuestions[selectedPic].pictureUrl}
                questions={pictureAndQuestions[selectedPic].speakingPictureListQuestions}
                increNum={completeSpeakingPicture}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}