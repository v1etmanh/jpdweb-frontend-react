import  { useState, useEffect, useRef } from 'react';


const SpeakingPictureQuestion = ({ imageUrl, questions, increNum ,evaluateAnswerSpeaking}) => {
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('idle'); // 'idle', 'recording', 'playing'
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [results, setResults] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [showTextQuestion, setShowTextQuestion] = useState(false);
  // Set to track API calls in progress
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [processingStatus, setProcessingStatus] = useState('');

  // Refs for resources that need cleanup
  const audioChunks = useRef([]);
  const recordingTimerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [hasCalledIncreNum, setHasCalledIncreNum] = useState(false);
  const halfCount = Math.ceil(questions.length/2);
  // Thêm state này vào đầu component
const [isOutOfRequests, setIsOutOfRequests] = useState(false);

// Thêm hàm xử lý khi hết lượt
const handleOutOfRequests = () => {
  console.log("Xử lý hết lượt request");
  
  // Dừng tất cả hoạt động
  cleanupResources();
  
  // Set trạng thái hết lượt
  setIsOutOfRequests(true);
  
  // Reset các state khác
  setPhase('idle');
  setError(null);
 
  setPendingRequests(0);
};
  // Initialize on component mount
  useEffect(() => {
    if (!isInitialized) {
      console.log("Initializing component");
      setHasCalledIncreNum(false);
      setResults([]);
      
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone permission granted");
          const recorder = new MediaRecorder(stream);
          
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunks.current.push(e.data);
            }
          };
          
          recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            audioChunks.current = [];
            
            // Process recording asynchronously
            processRecordingAsync(audioBlob, currentIdx);
            
            // Transition to idle state immediately so user can continue
            setPhase('idle');
          };
          
          setMediaRecorder(recorder);
        })
        .catch(err => {
          console.error("Microphone permission error:", err);
          setError("Cannot access microphone");
        });
      
      setIsInitialized(true);
    }
    
    return () => {
      cleanupResources();
    };
  }, [isInitialized, currentIdx]);

  // Process recording asynchronously
  const processRecordingAsync = async (blob, questionIdx) => {
    const requestId = `request_${questionIdx}_${Date.now()}`;
    
    try {
      // Add request to pending list
      setPendingRequests(prev => new Set([...prev, requestId]));
      setProcessingStatus(`Processing answer for question ${questionIdx + 1}...`);
      
      // Send audio to server
      const formData = new FormData();
      formData.append('audio', blob, `audio_${questionIdx}.webm`);
      formData.append('sentence', questions[questionIdx].answer);
      
      const response = await evaluateAnswerSpeaking(formData);
      console.log(`Audio for question ${questionIdx + 1} sent successfully`);
      
      // Add result to results array
      const newResult = {
        questionIndex: questionIdx,
        question: questions[questionIdx].question,
        expected_answer: questions[questionIdx].answer,
        user_answer: response.data.user_answer || "No response detected",
        similarity_score: response.data.similarity_score || 0,
        match: response.data.match || false,
        timestamp: new Date().toISOString()
      };
      
      // Update results in order by questionIndex
      setResults(prevResults => {
        const newResults = [...prevResults];
        // Find correct position to insert result by questionIndex
        const insertIndex = newResults.findIndex(r => r.questionIndex > questionIdx);
        if (insertIndex === -1) {
          newResults.push(newResult);
        } else {
          newResults.splice(insertIndex, 0, newResult);
        }
        return newResults;
      });
      
      // Remove request from pending list
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      
      // Update processing status
      setPendingRequests(prev => {
        if (prev.size <= 1) {
          setProcessingStatus('');
        } else {
          setProcessingStatus(`Processing ${prev.size - 1} more answers...`);
        }
        return prev;
      });
      
    } catch (error) {
      console.error(`Error processing audio for question ${questionIdx + 1}:`, error);
      if (error.response && error.response.status === 400) {
          console.log("Đã hết lượt request hôm nay");
          handleOutOfRequests();
          return;
        }
      // Add error result
      const errorResult = {
        questionIndex: questionIdx,
        question: questions[questionIdx].question,
        expected_answer: questions[questionIdx].answer,
        user_answer: "Error processing audio",
        similarity_score: 0,
        match: false,
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setResults(prevResults => {
        const newResults = [...prevResults];
        const insertIndex = newResults.findIndex(r => r.questionIndex > questionIdx);
        if (insertIndex === -1) {
          newResults.push(errorResult);
        } else {
          newResults.splice(insertIndex, 0, errorResult);
        }
        return newResults;
      });
      
      // Remove request from pending list
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      
      // Update processing status
      setPendingRequests(prev => {
        if (prev.size <= 1) {
          setProcessingStatus('');
        } else {
          setProcessingStatus(`Processing ${prev.size - 1} more answers...`);
        }
        return prev;
      });
    }
  };

  // Start recording
  const startRecording = () => {
    if (!mediaRecorder || isRecording) return;
    
    audioChunks.current = [];
    
    // Capture currentIdx for the onstop callback
    const capturedIdx = currentIdx;
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioChunks.current = [];
      // Process asynchronously with captured index
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

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorder || !isRecording) return;
    
    try {
      clearInterval(timerIntervalRef.current);
      clearTimeout(recordingTimerRef.current);
      
      mediaRecorder.stop();
      setIsRecording(false);
      
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Error stopping recording");
      setIsRecording(false);
      setPhase('idle');
    }
  };

  // Submit answer and move to next question
  const submitAnswer = () => {
    if (isRecording) {
      stopRecording();
      // Wait briefly for recording to fully stop before moving on
      setTimeout(() => {
        nextQuestion();
      }, 100);
    } else {
      nextQuestion();
    }
  };

  // Move to next question
  const nextQuestion = () => {
    setCurrentIdx(prev => {
      const nextIdx = prev + 1;
      console.log(`Moving to question ${nextIdx + 1}/${questions.length}`);
      return nextIdx;
    });
    
    setError(null);
    setPhase('idle');
    setUserAnswer('');
  };

  // Clean up all resources
  const cleanupResources = () => {
    console.log("Cleaning up resources");
    
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (mediaRecorder && isRecording) {
      try {
        mediaRecorder.stop();
      } catch (e) {
        console.error("Error stopping media recorder:", e);
      }
    }
    
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsRecording(false);
    setIsPlayingQuestion(false);
  };

  // Restart practice
  const restartPractice = () => {
    console.log("Restarting from beginning");
    cleanupResources();
    setCurrentIdx(0);
    setPhase('idle');
    setError(null);
    setResults([]);
    setUserAnswer('');
    setPendingRequests(new Set());
    setProcessingStatus('');
    setHasCalledIncreNum(false);
      setIsOutOfRequests(false);
  };

  // Play question using text-to-speech
  const playQuestion = () => {
    const currentQuestion = questions[currentIdx].question;
    setPhase('playing');
    setIsPlayingQuestion(true);
    
    try {
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        window.responsiveVoice.speak(currentQuestion, "US English Female", {
          onend: () => {
            console.log("Question playback complete");
            setPhase('idle');
            setIsPlayingQuestion(false);
          },
          onerror: (e) => {
            console.error("ResponsiveVoice error:", e);
            fallbackSpeechSynthesis(currentQuestion);
          }
        });
      } else {
        fallbackSpeechSynthesis(currentQuestion);
      }
    } catch (err) {
      console.error("Error playing question:", err);
      setError("Cannot play question audio");
      setPhase('idle');
      setIsPlayingQuestion(false);
    }
  };
  
  // Fallback to browser's speech synthesis
  const fallbackSpeechSynthesis = (text) => {
    if (!('speechSynthesis' in window)) {
      setError("Browser doesn't support speech synthesis");
      setPhase('idle');
      setIsPlayingQuestion(false);
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      console.log("Question playback complete");
      setPhase('idle');
      setIsPlayingQuestion(false);
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setError("Error playing question");
      setPhase('idle');
      setIsPlayingQuestion(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Evaluate results and call increNum if criteria met
  const evaluateResults = () => {
    console.log("Evaluating final results");
    
    // Count matched/correct answers
    let matchedCount = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].match) {
        matchedCount++;
      }
    }
    
    // Calculate required matches (at least half of the questions answered)
    const requiredMatches = Math.ceil(halfCount / 2);
    console.log(`Correct answers: ${matchedCount}/${requiredMatches} required`);
    
    // Call increNum() if enough correct answers
    if (matchedCount >= requiredMatches) {
      console.log("Criteria met, calling increNum()");
      setHasCalledIncreNum(true);
      increNum();
    }
  };

  // Check completion when all questions are done and pending requests are completed
  useEffect(() => {
    if (currentIdx >= questions.length && pendingRequests.size === 0 && !hasCalledIncreNum) {
      console.log("All questions completed and no pending requests, evaluating results");
      evaluateResults();
    }
  }, [currentIdx, pendingRequests.size, hasCalledIncreNum, questions.length, increNum, halfCount, results]);

  // Render completion screen
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
  if (currentIdx >= questions.length) {
    return (
      <div className="completion-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Practice Completed!</h2>
        <p style={{ fontSize: '16px', marginBottom: '30px' }}>You have completed all questions.</p>
        
        {/* Display message if pending requests exist */}
        {pendingRequests.size > 0 && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '20px',
            color: '#856404'
          }}>
            <p><strong>Note:</strong> {pendingRequests.size} answer(s) are still being processed. Results will appear when ready.</p>
            {processingStatus && <p>{processingStatus}</p>}
          </div>
        )}
        
        <div className="results-container" style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            Your Results ({results.length}/{questions.length} processed)
          </h3>
          
          {results.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No results yet. Processing your answers...
            </p>
          ) : (
            results.map((r, i) => (
              <div key={i} style={{ 
                backgroundColor: r.error ? '#ffebee' : '#f9f9f9', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: `1px solid ${r.error ? '#ffcdd2' : '#eee'}`
              }}>
                <p><strong>Question {r.questionIndex + 1}:</strong> {r.question}</p>
                <p><strong>Expected Answer:</strong> {r.expected_answer}</p>
                <p><strong>Your Answer:</strong> {r.user_answer}</p>
                {!r.error && (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '24px', 
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: r.match ? '#4caf50' : '#f44336',
                      marginRight: '10px',
                      textAlign: 'center',
                      lineHeight: '24px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {r.match ? '✓' : '✗'}
                    </span>
                    <span>Similarity Score: {r.similarity_score.toFixed(2)}%</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <button 
          onClick={restartPractice}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          Practice Again
        </button>
      </div>
    );
  }

  // Current question
  const currentQuestion = questions[currentIdx];

  // Main render
  return (
    <div className="speaking-practice-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="progress-indicator" style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h3 style={{ margin: 0 }}>Question {currentIdx + 1}/{questions.length}</h3>
          <span style={{ color: '#666' }}>
            {Math.round((currentIdx / questions.length) * 100)}% complete
          </span>
        </div>
        
        <div style={{ 
          height: '6px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '3px', 
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: '100%', 
            width: `${(currentIdx / questions.length) * 100}%`, 
            backgroundColor: '#3498db', 
            borderRadius: '3px'
          }}></div>
        </div>
      </div>

      {/* Display processing status */}
      {processingStatus && (
        <div style={{
          backgroundColor: '#e8f4f8',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '15px',
          color: '#2980b9',
          fontSize: '14px'
        }}>
          {processingStatus}
        </div>
      )}
      
      {imageUrl && (
        <div className="image-container" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <img 
            src={imageUrl} 
            alt="Question visual" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      )}
      
      <div className="question-container" style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '15px 0',
          marginBottom: '15px' 
        }}>
          <button
            onClick={playQuestion}
            disabled={isPlayingQuestion}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              backgroundColor: isPlayingQuestion ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isPlayingQuestion ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              margin: '0 auto',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <svg 
              style={{ marginRight: '8px' }} 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            {isPlayingQuestion ? 'Playing Question...' : 'Listen to Question'}
            
          </button>
          {/* Show question button */}
          <button 
            className='btn btn-primary' 
            onClick={() => setShowTextQuestion(prev => !prev)}
            style={{
              marginLeft: '10px',
              padding: '8px 16px'
            }}
          >
            {showTextQuestion ? 'Hide Question Text' : 'Show Question Text'}
          </button>

          {/* Question content */}
          {showTextQuestion && (
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
              {currentQuestion.question}
            </div>
          )}
          
          {isPlayingQuestion && (
            <p style={{ 
              margin: '15px 0 0 0', 
              color: '#3498db',
              fontSize: '14px' 
            }}>
              Playing audio... Please listen carefully.
            </p>
          )}
        </div>
        
        <div className="answer-area" style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #ddd',
          minHeight: '80px',
          position: 'relative'
        }}>
          {userAnswer ? (
            <p>{userAnswer}</p>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              {isRecording ? 'Recording your answer...' : 'Your answer will appear here'}
            </p>
          )}
          
          {phase === 'recording' && (
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              right: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              Recording: {recordingTime}s
            </div>
          )}
        </div>
      </div>
      
      <div className="controls" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={phase === 'playing'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: isRecording ? '#e74c3c' : '#3498db',
            color: 'white',
            border: 'none',
            cursor: (phase === 'playing') ? 'not-allowed' : 'pointer',
            opacity: (phase === 'playing') ? 0.7 : 1,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isRecording ? (
              <rect x="6" y="6" width="12" height="12" />
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </>
            )}
          </svg>
        </button>

        {error && (
          <div style={{color: 'red', margin: '0 15px', fontSize: '14px'}}>
            Error: {error}
          </div>
        )}
        
        <button
          onClick={submitAnswer}
          disabled={phase === 'playing'}
          style={{
            padding: '12px 24px',
            backgroundColor: (phase === 'playing') ? '#bdc3c7' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (phase === 'playing') ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          {isRecording ? 'Stop & Submit' : 'Submit & Continue'}
        </button>
      </div>
      
      {phase === 'playing' && (
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
          color: '#2980b9'
        }}>
          Playing question audio... Please listen.
        </div>
      )}
      
      <div style={{
        marginTop: '30px',
        fontSize: '14px',
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '15px'
      }}>
        <p style={{ margin: '5px 0' }}>Status: {phase}</p>
        <p style={{ margin: '5px 0' }}>
          Tip: You can continue to the next question immediately after recording. Results will be processed in the background.
        </p>
        {pendingRequests.size > 0 && (
          <p style={{ margin: '5px 0', color: '#3498db' }}>
            {pendingRequests.size} answer(s) being processed in background...
          </p>
        )}
      </div>
    </div>
  );
};

export default SpeakingPictureQuestion;