import { useState, useEffect, useRef } from 'react';
import { evaluateAnswer } from '../../api/ApiConnect';
import { showWarningNotification } from '../../api/core/apiClient';

const SpeakingPictureQuestion = ({ imageUrl, questions, increNum, language }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [results, setResults] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [showTextQuestion, setShowTextQuestion] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [processingStatus, setProcessingStatus] = useState('');
  const [hasCalledIncreNum, setHasCalledIncreNum] = useState(false);
  const [isOutOfRequests, setIsOutOfRequests] = useState(false);
  // THÊM: State để lưu câu trả lời hiện tại
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  const halfCount = Math.ceil(questions.length / 2);
  const audioChunks = useRef([]);
  const recordingTimerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const audioRef = useRef(new Audio());

  const languageMap = {
    'ENGLISH': 'en-US',
    'VIETNAMESE': 'vi-VN',
    'CHINESE': 'zh-CN',
    'JAPANESE': 'ja-JP',
    'KOREAN': 'ko-KR',
    'FRENCH': 'fr-FR',
    'GERMAN': 'de-DE',
    'SPANISH': 'es-ES',
    'ITALIAN': 'it-IT',
    'RUSSIAN': 'ru-RU',
  };

  const handleOutOfRequests = () => {
    cleanupResources();
    setIsOutOfRequests(true);
    setPhase('idle');
    setError(null);
    setPendingRequests(new Set());
  };

  // Initialize component
  useEffect(() => {
    if (!isInitialized) {
      setHasCalledIncreNum(false);
      setResults([]);
      setCurrentAnswer(''); // THÊM: Reset câu trả lời hiện tại
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunks.current.push(e.data);
          };
          
          recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            audioChunks.current = [];
            processRecordingAsync(audioBlob, currentIdx);
            setPhase('idle');
          };
          
          setMediaRecorder(recorder);
        })
        .catch(err => setError("Không thể truy cập microphone"));
      
      setIsInitialized(true);
    }
    
    return () => cleanupResources();
  }, [isInitialized, currentIdx]);
  
const checkAudioDuration = (blob, maxDuration = 23) => {
  return new Promise((resolve) => {
    const audio = new Audio(URL.createObjectURL(blob));
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration <= maxDuration);
    };
    
    audio.onerror = () => resolve(false);
  });
};
  const processRecordingAsync = async (blob, questionIdx) => {
    const requestId = `request_${questionIdx}_${Date.now()}`;
    
    try {
      setPendingRequests(prev => new Set([...prev, requestId]));
      setProcessingStatus(`Đang xử lý câu trả lời cho câu hỏi ${questionIdx + 1}...`);
      
      const formData = new FormData();
      formData.append('audio', blob, `audio_${questionIdx}.webm`);
      formData.append('sentence', questions[questionIdx].answer);
      formData.append('language', languageMap[language].substring(0,2));
     const isValid = await checkAudioDuration(blob, 23);
    
    if (!isValid) {
      showWarningNotification("Audio có độ dài quá lớn (tối đa 23 giây)");
      return; // Dừng lại, không gửi request
    }
      const response = await evaluateAnswer(formData);
      
      // THÊM: Cập nhật câu trả lời hiện tại để hiển thị
      const userAnswer = response.data.user_answer || "Không nhận diện được câu trả lời";
      setCurrentAnswer(userAnswer);
      
      const newResult = {
        questionIndex: questionIdx,
        question: questions[questionIdx].question,
        expected_answer: questions[questionIdx].answer,
        user_answer: userAnswer,
        similarity_score: response.data.similarity_score || 0,
        match: response.data.match || false,
        timestamp: new Date().toISOString()
      };
      
      setResults(prevResults => {
        const newResults = [...prevResults];
        const insertIndex = newResults.findIndex(r => r.questionIndex > questionIdx);
        if (insertIndex === -1) newResults.push(newResult);
        else newResults.splice(insertIndex, 0, newResult);
        return newResults;
      });
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        handleOutOfRequests();
        return;
      }
      
      // THÊM: Cập nhật thông báo lỗi
      const errorMessage = "Lỗi xử lý âm thanh";
      setCurrentAnswer(errorMessage);
      
      const errorResult = {
        questionIndex: questionIdx,
        question: questions[questionIdx].question,
        expected_answer: questions[questionIdx].answer,
        user_answer: errorMessage,
        similarity_score: 0,
        match: false,
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setResults(prevResults => {
        const newResults = [...prevResults];
        const insertIndex = newResults.findIndex(r => r.questionIndex > questionIdx);
        if (insertIndex === -1) newResults.push(errorResult);
        else newResults.splice(insertIndex, 0, errorResult);
        return newResults;
      });
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        if (newSet.size <= 1) setProcessingStatus('');
        else setProcessingStatus(`Đang xử lý ${newSet.size - 1} câu trả lời khác...`);
        return newSet;
      });
    }
  };

  const startRecording = () => {
    if (!mediaRecorder || isRecording) return;
    
    audioChunks.current = [];
    const capturedIdx = currentIdx;
    
    // THÊM: Reset câu trả lời hiện tại khi bắt đầu ghi âm mới
    setCurrentAnswer('');
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioChunks.current = [];
      processRecordingAsync(blob, capturedIdx);
      setPhase('idle');
    };

    mediaRecorder.start();
    setIsRecording(true);
    setPhase('recording');
    setRecordingTime(0);
    timerIntervalRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    recordingTimerRef.current = setTimeout(stopRecording, 30000);
  };

  const stopRecording = () => {
    if (!mediaRecorder || !isRecording) return;
    
    try {
      clearInterval(timerIntervalRef.current);
      clearTimeout(recordingTimerRef.current);
      mediaRecorder.stop();
      setIsRecording(false);
    } catch (err) {
      setError("Lỗi dừng ghi âm");
      setIsRecording(false);
      setPhase('idle');
    }
  };

  const submitAnswer = () => {
    if (isRecording) {
      stopRecording();
      setTimeout(nextQuestion, 100);
    } else {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    // THÊM: Reset câu trả lời khi chuyển câu hỏi
    setCurrentAnswer('');
    setCurrentIdx(prev => prev + 1);
    setError(null);
    setPhase('idle');
  };

  const cleanupResources = () => {
    [recordingTimerRef, timerIntervalRef].forEach(ref => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });
    
    if (mediaRecorder && isRecording) {
      try { mediaRecorder.stop(); } catch (e) { console.error(e); }
    }
    
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }
    
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsRecording(false);
    setIsPlayingQuestion(false);
  };

  const restartPractice = () => {
    cleanupResources();
    setCurrentIdx(0);
    setPhase('idle');
    setError(null);
    setResults([]);
    setPendingRequests(new Set());
    setProcessingStatus('');
    setHasCalledIncreNum(false);
    setIsOutOfRequests(false);
    setCurrentAnswer(''); // THÊM: Reset câu trả lời
  };

  const playQuestion = () => {
    const currentQuestion = questions[currentIdx].question;
    setPhase('playing');
    setIsPlayingQuestion(true);
    
    try {
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        window.responsiveVoice.speak(currentQuestion, "US English Female", {
          onend: () => {
            setPhase('idle');
            setIsPlayingQuestion(false);
          },
          onerror: (e) => fallbackSpeechSynthesis(currentQuestion)
        });
      } else {
        fallbackSpeechSynthesis(currentQuestion);
      }
    } catch (err) {
      setError("Không thể phát câu hỏi");
      setPhase('idle');
      setIsPlayingQuestion(false);
    }
  };
  
  const fallbackSpeechSynthesis = (text) => {
    if (!('speechSynthesis' in window)) {
      setError("Trình duyệt không hỗ trợ phát âm thanh");
      setPhase('idle');
      setIsPlayingQuestion(false);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language];
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setPhase('idle');
      setIsPlayingQuestion(false);
    };
    
    utterance.onerror = () => {
      setError("Lỗi phát câu hỏi");
      setPhase('idle');
      setIsPlayingQuestion(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const evaluateResults = () => {
    let matchedCount = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].match) matchedCount++;
    }
    
    const requiredMatches = Math.ceil(halfCount / 2);
    if (matchedCount >= requiredMatches) {
      setHasCalledIncreNum(true);
      increNum();
    }
  };

  useEffect(() => {
    if (currentIdx >= questions.length && pendingRequests.size === 0 && !hasCalledIncreNum) {
      evaluateResults();
    }
  }, [currentIdx, pendingRequests.size, hasCalledIncreNum, questions.length, increNum, halfCount, results]);

  // Out of requests screen
  if (isOutOfRequests) {
    return (
      <div className="card p-6 bg-surface border border-status-required/20 rounded-2xl shadow-medium animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-status-required mb-3">
            Bạn đã hết lượt hôm nay!
          </h2>
          <p className="text-text-secondary mb-6">
            Số lượt luyện tập của bạn đã được sử dụng hết.<br/>
            Vui lòng quay lại vào ngày mai để tiếp tục luyện tập.
          </p>
          <button 
            onClick={() => {
              setIsOutOfRequests(false);
              restartPractice();
            }}
            className="btn-primary py-3 px-6 rounded-xl font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (currentIdx >= questions.length) {
    const matchedCount = results.filter(r => r.match).length;
    const requiredMatches = Math.ceil(halfCount / 2);
    
    return (
      <div className="card p-6 bg-surface rounded-2xl shadow-medium animate-scale-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4 text-primary-30">🎉</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Hoàn thành!</h2>
          <p className="text-text-secondary">Bạn đã hoàn thành tất cả câu hỏi.</p>
        </div>
        
        {pendingRequests.size > 0 && (
          <div className="bg-status-required/10 border border-status-required/30 rounded-xl p-4 mb-6 animate-pulse-soft">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-30 mr-3"></div>
              <span className="text-status-required font-medium">Đang xử lý {pendingRequests.size} câu trả lời...</span>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="font-bold text-text-primary mb-4 text-lg">
            Kết quả của bạn ({results.length}/{questions.length} đã xử lý)
          </h3>
          
          <div className={`rounded-xl p-4 mb-4 ${
            matchedCount >= requiredMatches 
              ? 'bg-status-completed/10 border border-status-completed/30' 
              : 'bg-status-required/10 border border-status-required/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Số câu đúng:</span>
              <span className={`font-bold text-lg ${matchedCount >= requiredMatches ? 'text-status-completed' : 'text-status-required'}`}>
                {matchedCount}/{requiredMatches}
              </span>
            </div>
            <div className={`text-center mt-2 p-2 rounded-lg ${
              matchedCount >= requiredMatches ? 'bg-status-completed/20' : 'bg-status-required/20'
            }`}>
              <span className={`font-bold ${matchedCount >= requiredMatches ? 'text-status-completed' : 'text-status-required'}`}>
                {matchedCount >= requiredMatches ? '✅ Đạt yêu cầu!' : '❌ Chưa đạt yêu cầu'}
              </span>
            </div>
          </div>
          
          {results.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className={`bg-background border rounded-xl p-4 ${
                  r.error ? 'border-status-required/30' : 'border-border-light'
                }`}>
                  <div className="flex items-start mb-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-1 flex-shrink-0 ${
                      r.error ? 'bg-status-required text-white' : 
                      r.match ? 'bg-status-completed text-white' : 'bg-status-required text-white'
                    }`}>
                      {r.error ? '!' : (r.match ? '✓' : '✗')}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary mb-1">Câu hỏi {r.questionIndex + 1}: {r.question}</p>
                      {!r.error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium text-text-secondary">Câu trả lời của bạn:</span> {r.user_answer}</div>
                          <div><span className="font-medium text-text-secondary">Độ chính xác:</span> {r.similarity_score}%</div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-text-secondary">Câu trả lời đúng:</span> {r.expected_answer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-center">
          <button 
            onClick={restartPractice}
            className="btn-primary py-3 px-8 rounded-xl font-medium"
          >
            Luyện tập lại
          </button>
        </div>
      </div>
    );
  }

  // Main practice screen
  const currentQuestion = questions[currentIdx];

  return (
    <div className="card p-6 bg-surface rounded-2xl shadow-medium animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center">
          <span className="text-primary-30 mr-2"></span>
          Luyện nói theo hình ảnh
        </h2>
        <div className="flex justify-between items-center text-text-secondary">
          <span>Câu hỏi {currentIdx + 1}/{questions.length}</span>
          <div className="flex items-center">
            <span className="mr-2">Tiến độ:</span>
            <div className="w-24 h-2 bg-border-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-30 rounded-full transition-all duration-500"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {processingStatus && (
        <div className="bg-primary-30/10 border border-primary-30/30 rounded-xl p-3 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-30 mr-2"></div>
            <span className="text-primary-30 text-sm">{processingStatus}</span>
          </div>
        </div>
      )}
      
      {imageUrl && (
        <div className="mb-6 text-center">
          <img 
            src={imageUrl} 
            alt="Question visual" 
            className="max-w-full max-h-64 rounded-xl shadow-soft mx-auto"
          />
        </div>
      )}
      
      <div className="bg-background border border-border-light rounded-xl p-5 mb-6">
        <div className="text-center mb-4">
          <button
            onClick={playQuestion}
            disabled={isPlayingQuestion}
            className={`btn-primary py-3 px-6 rounded-xl font-medium flex items-center justify-center mx-auto ${
              isPlayingQuestion ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 110 12m0 0v-6m0 6h6" />
            </svg>
            {isPlayingQuestion ? 'Đang phát...' : 'Nghe câu hỏi'}
          </button>
          
          <button 
            onClick={() => setShowTextQuestion(prev => !prev)}
            className="mt-3 text-primary-30 hover:text-primary-30/80 font-medium text-sm flex items-center justify-center mx-auto"
          >
            {showTextQuestion ? 'Ẩn câu hỏi' : 'Hiển thị câu hỏi'}
          </button>
        </div>

        {showTextQuestion && (
          <div className="bg-primary-30/5 border border-primary-30/20 rounded-lg p-4 mt-3">
            <p className="text-text-primary font-medium text-center">{currentQuestion.question}</p>
          </div>
        )}
        
        {isPlayingQuestion && (
          <div className="text-center mt-3">
            <div className="flex items-center justify-center text-primary-30">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-30 mr-2"></div>
              <span className="text-sm">Đang phát âm thanh...</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-primary-30/5 border border-primary-30/20 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-primary-30 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Khu vực ghi âm
        </h3>
        
        <div className="bg-white border border-border-main rounded-lg p-4 min-h-20 relative">
          {isRecording ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-status-required rounded-full animate-ping mr-2"></div>
                <span className="text-status-required font-bold">ĐANG GHI ÂM</span>
              </div>
              <p className="text-status-required">Thời gian: {recordingTime}s</p>
            </div>
          ) : currentAnswer ? (
            // THÊM: Hiển thị câu trả lời đã được xử lý
            <div className="text-center">
              <p className="font-medium text-text-primary mb-2">Câu trả lời của bạn:</p>
              <p className="text-text-primary bg-primary-30/10 rounded-lg p-3">{currentAnswer}</p>
            </div>
          ) : (
            <p className="text-text-muted text-center italic">
              {phase === 'playing' ? 'Vui lòng nghe câu hỏi trước...' : 'Câu trả lời của bạn sẽ xuất hiện ở đây'}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={phase === 'playing'}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-status-required hover:bg-status-required/90 text-white' 
              : phase === 'playing'
              ? 'bg-border-light text-text-muted cursor-not-allowed'
              : 'bg-primary-30 hover:bg-primary-30/90 text-white'
          }`}
        >
          {isRecording ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {error && (
          <div className="flex-1 mx-4">
            <div className="bg-status-required/10 border border-status-required/30 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-status-required mr-2">⚠️</span>
                <span className="text-status-required text-sm">{error}</span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={submitAnswer}
          disabled={phase === 'playing'}
          className={`py-3 px-6 rounded-xl font-medium transition-all ${
            phase === 'playing'
              ? 'bg-border-light text-text-muted cursor-not-allowed'
              : 'bg-accent-10 hover:bg-accent-10/90 text-white'
          }`}
        >
          {isRecording ? 'Dừng & Tiếp tục' : 'Tiếp tục'}
        </button>
      </div>
      
      {pendingRequests.size > 0 && (
        <div className="mt-4 text-center">
          <p className="text-text-muted text-sm">
            Đang xử lý {pendingRequests.size} câu trả lời trong nền...
          </p>
        </div>
      )}
    </div>
  );
};

export default SpeakingPictureQuestion;