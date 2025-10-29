import { useState, useEffect, useRef } from 'react';

import { useReactMediaRecorder } from 'react-media-recorder';
import { evaluateAnswer } from './api/ApiConnect';
import { useSearchParams } from 'react-router-dom';


const ReadPractice = ({ paragraph, increNum,language }) => {
  // Split paragraph into sentences
  const sentences = paragraph.split(/[。.！？]/).filter(Boolean);
  const halfCount = Math.ceil(sentences.length / 2);
  
  // Component state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle', 'countdown', 'recording', 'playing'
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [results, setResults] = useState([]);
  const [pendingApiCalls, setPendingApiCalls] = useState(0);
  const [hasCalledIncreNum, setHasCalledIncreNum] = useState(false);
  const [isOutOfRequests, setIsOutOfRequests] = useState(false);
  // Prevent concurrent operations
  const isBusyRef = useRef(false);
  
  // Refs for resources that need cleanup
  const audioRef = useRef(new Audio());
  const countdownTimerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const phaseChangeTimerRef = useRef(null);
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
  console.log("Xử lý hết lượt request");
  
  // Dừng tất cả hoạt động
  cleanupResources();
  
  // Set trạng thái hết lượt
  setIsOutOfRequests(true);
  
  // Reset các state khác
  setPhase('idle');
  setError(null);
  isBusyRef.current = false;
  setPendingApiCalls(0);
};
  // Media recorder setup
  const { status, startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl, blob) => {
      console.log("Media recorder onStop triggered");
      
      // Clear any recording timers
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Proceed to next sentence immediately
      setPhase('idle');
      
      // Schedule next sentence with a short delay
      if (phaseChangeTimerRef.current) clearTimeout(phaseChangeTimerRef.current);
      phaseChangeTimerRef.current = setTimeout(() => {
        console.log("Chuyển sang câu tiếp theo sau khi ghi âm");
        nextSentence();
        phaseChangeTimerRef.current = null;
      }, 800);
      
      // Process the audio asynchronously
      processAudioAsync(blob, sentences[currentIdx]);
      
      // Clean up blob URL
      clearBlobUrl();
    }
  });

  // Process audio asynchronously
  const processAudioAsync = async (blob, sentence) => {
    try {
      // Increment pending API calls counter
      
      setPendingApiCalls(prev => prev + 1);
      
      // Send audio to server
      const formData = new FormData();
      formData.append('audio', blob, `audio_${currentIdx}.webm`);
      formData.append('sentence', sentence);
      formData.append('language',languageMap[language].substring(0,2))
      // Make API call without waiting for response
      console.log("Đang gửi audio lên server...");
      
      // Call API asynchronously
      evaluateAnswer(formData)
        .then(response => {
          
          console.log("Đã nhận kết quả từ API:", response.data);
          
          // Add result when it arrives
          setResults(prevResults => [...prevResults, response.data]);
        })
        .catch(error => {
          console.error('Lỗi gửi audio:', error);
            if (error.response && error.response.status === 400) {
          console.log("Đã hết lượt request hôm nay");
          handleOutOfRequests();
          return;
        }
          // Add error result
          setResults(prevResults => [
            ...prevResults, 
            { 
              error: true, 
              message: "Lỗi gửi audio",
              expected_answer: sentence
            }
          ]);
        })
        .finally(() => {
          // Decrement pending API calls counter
          setPendingApiCalls(prev => prev - 1);
        });
    } catch (error) {
      console.error("Lỗi xử lý audio:", error);
      setPendingApiCalls(prev => prev - 1);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    if (!isInitialized) {
      console.log("Khởi tạo component");
      setResults([]);
      setPendingApiCalls(0);
      setHasCalledIncreNum(false);
      
      // Generate random sentences for user to read
      const indexes = [...Array(sentences.length).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, halfCount);
      setSelectedIndexes(indexes);
      
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => console.log("Đã được cấp quyền microphone"))
        .catch(err => {
          console.error("Lỗi quyền microphone:", err);
          alert("Lỗi quyền microphone:", err);
          setError("Không thể truy cập microphone");
        });
      
      setIsInitialized(true);
    }
    
    // Cleanup when component unmounts
    return () => {
      cleanupResources();
    };
  }, []);

  // Process current sentence when it changes
  useEffect(() => {
    if (!isInitialized || isBusyRef.current) return;
    
    // Check if we've finished all sentences
    if (currentIdx >= sentences.length) {
      console.log("Đã hoàn thành tất cả các câu");
      return;
    }
    
    // Allow some time for other state changes to settle
    const timeoutId = setTimeout(() => {
      console.log(`Xử lý câu ${currentIdx + 1}/${sentences.length}`);
      processSentence();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [currentIdx, isInitialized]);

  // Evaluate results when all sentences are done and API calls complete
  useEffect(() => {
    // Kiểm tra khi hoàn thành tất cả câu VÀ tất cả API calls đã xong
    if (currentIdx >= sentences.length && pendingApiCalls === 0 && !hasCalledIncreNum) {
      evaluateResults();
    }
  }, [currentIdx, pendingApiCalls, hasCalledIncreNum]);

  // Evaluate results and call increNum if criteria met
  const evaluateResults = () => {
    console.log("Đánh giá kết quả cuối cùng");
    
    // Đếm số câu khớp/đúng
    let matchedCount = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].match) {
        matchedCount++;
      }
    }
    
    // Tính số câu cần đúng (ít nhất một nửa số câu người dùng đọc)
    const requiredMatches = Math.ceil(halfCount / 2);
    console.log(`Số câu đúng: ${matchedCount}/${requiredMatches} cần thiết`);
    
    // Hiển thị kết quả cho người dùng
    setMatchedCount(matchedCount);
    setRequiredMatches(requiredMatches);
    
    // Gọi increNum() nếu đủ số câu đúng cần thiết
    if (matchedCount >= requiredMatches) {
      console.log("Đủ điểm, gọi increNum()");
      setHasCalledIncreNum(true);
      increNum();
    }
  };

  // Thêm state để hiển thị kết quả
  const [matchedCount, setMatchedCount] = useState(0);
  const [requiredMatches, setRequiredMatches] = useState(0);

  // Clean up all resources
  const cleanupResources = () => {
    console.log("Dọn dẹp tài nguyên");
    
    // Stop all timers
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (phaseChangeTimerRef.current) {
      clearTimeout(phaseChangeTimerRef.current);
      phaseChangeTimerRef.current = null;
    }
    
    // Stop audio playback
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    
    // Stop web speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop ResponsiveVoice if available
    if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
      window.responsiveVoice.cancel();
    }
  };

  // Process the current sentence
  const processSentence = async () => {
    // Prevent concurrent processing
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    
    try {
      const currentSentence = sentences[currentIdx];
      
      if (selectedIndexes.includes(currentIdx)) {
        console.log("Câu này người dùng sẽ đọc");
        startCountdown(currentSentence);
      } else {
        console.log("Câu này hệ thống sẽ đọc");
        await playSentence(currentSentence);
      }
    } catch (err) {
      console.error("Lỗi xử lý câu:", err);
      setError("Lỗi xử lý. Đang thử lại...");
      
      // Reset state and try again after a delay
      setTimeout(() => {
        setError(null);
        isBusyRef.current = false;
        processSentence();
      }, 2000);
    }
  };

  // Start countdown before recording
  const startCountdown = (sentence) => {
    console.log("Bắt đầu đếm ngược");
    setPhase('countdown');
    setCountdown(3);
    
    let count = 3;
    
    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
    
    // Start countdown recursively
    const runCountdown = () => {
      if (count <= 0) {
        console.log("Đếm ngược hoàn tất, bắt đầu ghi âm");
        countdownTimerRef.current = null;
        startRecordingWithTimeout(sentence);
        return;
      }
      
      setCountdown(count);
      console.log(`Đếm ngược: ${count}`);
      count--;
      
      countdownTimerRef.current = setTimeout(runCountdown, 1000);
    };
    
    // Start first countdown tick
    runCountdown();
  };

  // Start recording with timeout
  const startRecordingWithTimeout = (sentence) => {
    console.log("Bắt đầu ghi âm");
    setPhase('recording');
    
    try {
      // Calculate recording duration based on sentence length
      const charCount = sentence.trim().length;
      const durationMs = Math.max(4000, charCount * 80)+3000
      console.log(`Sẽ ghi âm trong ${durationMs/1000} giây`);
      
      // Clear any existing recording timer
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
      
      // Start recording after a short delay
      setTimeout(() => {
        startRecording();
        
        // Schedule stop recording
        recordingTimerRef.current = setTimeout(() => {
          console.log("Kết thúc ghi âm theo lịch trình");
          stopRecording();
          recordingTimerRef.current = null;
        }, durationMs);
      }, 300);
    } catch (err) {
      console.error("Lỗi bắt đầu ghi âm:", err);
      setError("Không thể bắt đầu ghi âm");
      
      // Reset and move to next sentence
      setPhase('idle');
      isBusyRef.current = false;
      nextSentence();
    }
  };

  // Play sentence audio
  const playSentence = async (text) => {
    setPhase('playing');
    console.log("Đang phát âm:", text);
    
    try {
      // Try primary method first
      await playWithAudioElement(text);
    } catch (err) {
      console.error("Lỗi phương pháp 1, thử phương pháp 2:", err);
      
      try {
        // Fallback to speech synthesis
        await playWithSpeechSynthesis(text);
      } catch (err2) {
        console.error("Lỗi phương pháp 2:", err2);
        setError("Không thể phát âm thanh");
      }
    } finally {
      setPhase('idle');
      isBusyRef.current = false;
      nextSentence();
    }
  };

  // Play audio using audio element
  const playWithAudioElement = (text) => {
    return new Promise((resolve, reject) => {
      const audio = audioRef.current;
      
      // Stop any current playback
      audio.pause();
      audio.currentTime = 0;
      
      // Try ResponsiveVoice if available
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        window.responsiveVoice.speak(text, "Japanese Female", {
          onend: () => {
            console.log("Phát âm hoàn tất");
            resolve();
          },
          onerror: (e) => {
            console.error("Lỗi ResponsiveVoice:", e);
            reject(e);
          }
        });
        return;
      }
      
      // Otherwise use local TTS API
      audio.src = `http://localhost:9090/api/tts?text=${encodeURIComponent(text)}&lang=${languageMap[language].substring(0,2)}`;
      
      audio.onended = () => {
        console.log("Phát âm hoàn tất");
        resolve();
      };
      
      audio.onerror = (e) => {
        console.error("Lỗi phát audio:", e);
        reject(e);
      };
      
      // Add timeout in case audio doesn't trigger events
      const timeoutMs = text.length * 200 + 5000;
      const timeoutId = setTimeout(() => {
        console.log("Audio timeout - forcing completion");
        resolve();
      }, timeoutMs);
      
      // Start playback
      audio.play().then(() => {
        // Clear timeout if audio starts successfully
        clearTimeout(timeoutId);
      }).catch(err => {
        console.error("Lỗi play:", err);
        clearTimeout(timeoutId);
        reject(err);
      });
    });
  };

  // Play audio using web speech synthesis
  const playWithSpeechSynthesis = (text) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error("Trình duyệt không hỗ trợ phát âm"));
        return;
      }
      
      // Cancel any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageMap[language];
      utterance.rate = 0.8;
      
      utterance.onend = () => {
        console.log("Phát âm hoàn tất");
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error("Lỗi phát âm:", event);
        reject(event);
      };
      
      // Add timeout in case speech doesn't trigger events
      const timeoutMs = text.length * 200 + 5000;
      setTimeout(() => {
        console.log("Speech timeout - forcing completion");
        resolve();
      }, timeoutMs);
      
      // Start speech
      window.speechSynthesis.speak(utterance);
    });
  };

  // Move to next sentence
  const nextSentence = () => {
    setCurrentIdx(prev => {
      const nextIdx = prev + 1;
      console.log(`Chuyển sang câu ${nextIdx + 1}/${sentences.length}`);
      return nextIdx;
    });
    
    setError(null);
    isBusyRef.current = false;
  };

  // Skip current sentence
  const skipSentence = () => {
    console.log("Bỏ qua câu hiện tại");
    
    // Clean up any ongoing processes
    cleanupResources();
    
    // Reset state
    setPhase('idle');
    setError(null);
    isBusyRef.current = false;
    
    // Move to next sentence
    nextSentence();
  };

  // Restart practice
  const restartPractice = () => {
    console.log("Bắt đầu lại từ đầu");
    
    // Clean up resources
    cleanupResources();
    setResults([]);
    setPendingApiCalls(0);
    setHasCalledIncreNum(false);
    setMatchedCount(0);
    setRequiredMatches(0);
     setIsOutOfRequests(false)
    // Reset state
    setCurrentIdx(0);
    setPhase('idle');
    setError(null);
    isBusyRef.current = false;
    
    // Generate new random selection
    const indexes = [...Array(sentences.length).keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, halfCount);
    setSelectedIndexes(indexes);
  };
//
// Thêm vào đầu hàm render, trước các điều kiện khác
if (isOutOfRequests) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '30px',
      margin: '20px 0'
    }}>
      <div style={{fontSize: '48px', marginBottom: '20px'}}>⚠️</div>
      <h2 style={{color: '#856404', marginBottom: '15px'}}>
        Bạn đã hết lượt hôm nay!
      </h2>
      <p style={{color: '#856404', textAlign: 'center', fontSize: '16px', marginBottom: '20px'}}>
        Số lượt luyện tập của bạn đã được sử dụng hết. <br/>
        Vui lòng quay lại vào ngày mai để tiếp tục luyện tập.
      </p>
      <button 
        onClick={() => {
          // Reset để có thể bắt đầu lại (nếu cần)
          setIsOutOfRequests(false);
          restartPractice();
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Thử lại
      </button>
    </div>
  );
}
  // Render completion screen
  if (currentIdx >= sentences.length) {
    return (
      <div>
        <h2>Đã hoàn thành!</h2>
        <p>Bạn đã luyện tập xong tất cả các câu.</p>
        
        {pendingApiCalls > 0 && (
          <div style={{margin: '15px 0', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px'}}>
            <p>⏳ Đang xử lý {pendingApiCalls} kết quả... Vui lòng chờ.</p>
          </div>
        )}
        
        {pendingApiCalls === 0 && (
          <div style={{margin: '15px 0', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px', border: '1px solid #c3e6cb'}}>
            <h4>Kết quả:</h4>
            <p>Số câu đúng: <strong>{matchedCount}</strong>/{requiredMatches} cần thiết</p>
            <p>{matchedCount >= requiredMatches ? 
              '✅ Bạn đã đạt đủ điểm!' : 
              '❌ Bạn chưa đạt đủ điểm. Hãy thử lại!'}
            </p>
          </div>
        )}
        
        {results.length > 0 ? (
          <div>
            <h3>Chi tiết đánh giá:</h3>
            {results.map((r, i) => (
              <div key={i} style={{margin: '15px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #dee2e6'}}>
                {r.error ? (
                  <p style={{color: 'red'}}><strong>❌ Lỗi:</strong> {r.message}</p>
                ) : (
                  <>
                    <p><strong>{r.match ? '✅ Đúng' : '❌ Sai'}</strong></p>
                    <p><strong>🎯 Tỉ lệ:</strong> {r.similarity_score}</p>
                    <p><strong>📊 Nhận dạng:</strong> {r.user_answer}</p>
                    <p><strong>🗣️ Câu đúng:</strong> {r.expected_answer}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có kết quả nào được ghi nhận.</p>
        )}
        
        <button 
          onClick={restartPractice}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Luyện tập lại
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div>
      <h1>{paragraph}</h1>
      <h2>Câu {currentIdx + 1}/{sentences.length}</h2>
      
      <div style={{fontSize: '24px', margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
        {sentences[currentIdx]}
      </div>

      {phase === 'countdown' && <h3>Chuẩn bị đọc: {countdown}</h3>}
      {phase === 'recording' && <h3>⏺ Đang ghi âm... Hãy đọc ngay!</h3>}
      {phase === 'playing' && <h3>🔊 Đang phát audio...</h3>}
      
      {error && (
        <div style={{color: 'red', margin: '10px 0'}}>
          Lỗi: {error}
        </div>
      )}
      
      <div style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
        <p>Trạng thái: {phase}</p>
        <p>Microphone: {status}</p>
        <p>Đã thu thập: {results.length} kết quả</p>
        <p>Đang xử lý: {pendingApiCalls} API calls</p>
      </div>
      
      <button
        onClick={skipSentence}
        disabled={phase !== 'idle' && phase !== 'countdown'}
        style={{
          padding: '8px 12px',
          backgroundColor: phase !== 'idle' && phase !== 'countdown' ? '#ccc' : '#999',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: phase !== 'idle' && phase !== 'countdown' ? 'not-allowed' : 'pointer',
          marginTop: '10px'
        }}
      >
        Bỏ qua
      </button>
    </div>
  );
};

export default ReadPractice;