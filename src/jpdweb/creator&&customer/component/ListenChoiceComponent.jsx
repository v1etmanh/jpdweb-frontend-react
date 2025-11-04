import { useState, useEffect, useRef } from "react";

// Định nghĩa các icon hình học
const IconTriangle = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);
const IconDiamond = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l10 10-10 10-10-10 10-10z" />
  </svg>
);
const IconCircle = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const IconSquare = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 2h20v20H2z" />
  </svg>
);

// Màu sắc cho các option - ban đầu xanh, khi chọn chuyển cam
const optionStyles = [
  { defaultColor: 'bg-primary-30', selectedColor: 'bg-accent-10', icon: IconTriangle },
  { defaultColor: 'bg-primary-30', selectedColor: 'bg-accent-10', icon: IconDiamond },
  { defaultColor: 'bg-primary-30', selectedColor: 'bg-accent-10', icon: IconCircle },
  { defaultColor: 'bg-primary-30', selectedColor: 'bg-accent-10', icon: IconSquare },
];

export default function ListeningQuiz({ question, options, inCreNum, img, language }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const utteranceRef = useRef(null);
  
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

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [question, options]);

  const handleSelect = (value) => {
    if (!submitted) {
      setSelected(value);
    }
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      const isCorrect = options[selected]?.correct;
      if (isCorrect) inCreNum();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      
      const wordCount = question.split(' ').length;
      const estimatedDuration = (wordCount / 2.5) * 1000;
      setDuration(estimatedDuration / 1000);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(interval);
          setCurrentTime(0);
          return;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(Math.min(elapsed, estimatedDuration / 1000));
      }, 100);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const isCorrect = submitted && options[selected]?.correct;

  if (!options || !question) return null;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Audio Player Sticky - To hơn và ngắn lại */}
       <div className="sticky top-0 z-50 bg-surface border-b border-border-light shadow-card">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Play Button và Info */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 bg-primary-30 text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-200 min-w-[120px] justify-center"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    Pausing
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play
                  </>
                )}
              </button>

              {/* Progress */}
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <span className="text-sm text-text-secondary min-w-[35px]">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-30 rounded-full transition-all duration-300"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary min-w-[35px] text-right">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Language và Status */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-text-secondary bg-background px-3 py-1 rounded-full">
                {language}
              </div>
              <div className="w-2 h-2 rounded-full bg-status-completed animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6 pt-6">
        {/* Hình ảnh và Câu hỏi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hình ảnh */}
          <div className="bg-surface rounded-2xl shadow-card border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Visual Reference</h3>
            <div className="aspect-video bg-background rounded-xl overflow-hidden border border-border-light">
              <img 
                src={img || "https://via.placeholder.com/800x450?text=Learning+Image"} 
                alt="Learning visual" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Câu hỏi và lựa chọn */}
          <div className="bg-surface rounded-2xl shadow-card border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Listen and Select the Correct Answer</h3>
            
            <div className="space-y-3">
              {options.map((option, i) => {
                const isOptionSelected = selected === i;
                const style = optionStyles[i] || optionStyles[0];
                const IconComponent = style.icon;
                
                // Xác định màu sắc dựa trên trạng thái
                let backgroundColor = style.defaultColor; // Mặc định màu xanh
                let textColor = 'text-white';
                
                if (submitted) {
                  if (option.correct) {
                    backgroundColor = 'bg-status-completed';
                  } else if (isOptionSelected && !option.correct) {
                    backgroundColor = 'bg-red-500';
                  } else {
                    backgroundColor = 'bg-border-light';
                    textColor = 'text-text-primary';
                  }
                } else if (isOptionSelected) {
                  backgroundColor = style.selectedColor; // Khi chọn chuyển sang cam
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && handleSelect(i)}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all duration-200
                      ${backgroundColor} ${textColor}
                      ${isOptionSelected && !submitted ? 'ring-2 ring-white/50' : ''}
                      flex items-center gap-4 font-medium
                      hover:scale-[1.01] active:scale-[0.99]
                    `}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isOptionSelected || (submitted && option.correct) ? 'bg-white/20' : 'bg-white/30'
                    }`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="flex-1 text-base">{option.optionText}</span>
                    {submitted && option.correct && (
                      <span className="text-white font-bold text-lg">✓</span>
                    )}
                    {submitted && isOptionSelected && !option.correct && (
                      <span className="text-white font-bold text-lg">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Nút Submit và Kết quả */}
            <div className="mt-6 space-y-3">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selected === null}
                  className="w-full bg-primary-30 text-white py-3 rounded-xl font-semibold hover:bg-primary-dark disabled:bg-border-light disabled:text-text-muted transition-all duration-200"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  <div className={`p-4 rounded-xl text-center font-semibold ${
                    isCorrect 
                      ? "bg-status-completed/10 text-status-completed border border-status-completed/30" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    {isCorrect ? "🎉 Correct Answer!" : "❌ Incorrect, please try again"}
                  </div>
                  
                  {!isCorrect && (
                    <button
                      onClick={handleReset}
                      className="w-full bg-white text-primary-30 border border-primary-30 py-3 rounded-xl font-semibold hover:bg-primary-30/10 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress và thông tin */}
        
      </div>
    </div>
  );
}