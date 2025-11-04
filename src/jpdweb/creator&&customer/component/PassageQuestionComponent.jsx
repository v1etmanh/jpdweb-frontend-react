import { useEffect, useState, useRef } from "react";
import PassageMultipleChoiceComponent from "./PassageMultipleChoiceComponent";

export default function PassageWithQuestions({ text, questionAndOption, increNum }) {
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [isChange, setISChange] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const passageRef = useRef(null);
  const topRef = useRef(null);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswerChange = (questionId, selectedIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
  };

  const handleSubmitAll = () => {
    setSubmitted(true);
    let correctCount = 0;
    questionAndOption.forEach((q, idx) => {
      const userAnswer = answers[q.rqId];
      if (userAnswer !== undefined && q.readingQuestionOptions[userAnswer]?.correct) {
        correctCount++;
      }
    });
    setNumTrueAns(correctCount);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setNumTrueAns(0);
    setISChange(false);
    setShowAllExplanations(false);
  };

  const handleShowAllExplanations = () => {
    setShowAllExplanations(!showAllExplanations);
  };

  const scrollToPassage = () => {
    passageRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    if (numTrueAns > (questionAndOption.length / 2) && !isChange && submitted) {
      increNum();
      setISChange(true);
    }
  }, [numTrueAns, submitted, isChange, questionAndOption.length, increNum]);

  const allAnswered = questionAndOption.every(q => answers[q.rqId] !== undefined);
  const totalQuestions = questionAndOption.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background py-6" ref={topRef}>
      <div className="max-w-3xl mx-auto bg-surface rounded-xl shadow-card overflow-hidden">
        {/* Main Content Container */}
        <div className="p-6">
          {/* Header Section - Compact */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 bg-accent-10/10 px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-accent-10 rounded-full"></span>
              <span className="text-xs font-semibold text-accent-10">EXERCISE 4</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">WHY DON'T BABIES TALK LIKE ADULTS?</h1>
            <p className="text-sm text-text-secondary italic">
              Kids go from 'goo-goo' to talkative one step at a time
            </p>
          </div>

          {/* Passage and Questions Container */}
          <div className="space-y-6">
            {/* Passage Section - Compact */}
            <div 
              ref={passageRef}
              className="bg-background rounded-lg border border-border-light p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary-30 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📖</span>
                </div>
                <h3 className="text-base font-semibold text-text-primary">Reading Passage</h3>
              </div>
              <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {text}
              </div>
            </div>

            {/* Questions Section - Compact */}
            <div>
              {/* Instructions - Compact */}
              <div className="mb-4 p-3 bg-primary-30/5 rounded-lg border border-primary-30/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-primary-30 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Questions 14 - {13 + totalQuestions}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary pl-7">
                  Choose the correct letter A, B, C or D based on the reading passage.
                </p>
              </div>

              {/* Progress Indicator - Compact */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-border-light shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-primary">
                    Progress: {answeredCount}/{totalQuestions}
                  </span>
                  {submitted && (
                    <span className="px-2 py-1 bg-primary-30 text-white text-xs font-bold rounded-full">
                      {numTrueAns}/{totalQuestions}
                    </span>
                  )}
                </div>
                
                <div className="w-full bg-border-light rounded-full h-1.5">
                  <div 
                    className="bg-primary-30 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                
                {!submitted && (
                  <div className="mt-2 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      allAnswered 
                        ? "bg-status-completed/20 text-status-completed" 
                        : "bg-accent-10/20 text-accent-10"
                    }`}>
                      {allAnswered ? "✓ Ready to submit" : `${answeredCount}/${totalQuestions} answered`}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Questions List - Compact */}
              <div className="space-y-3">
                {questionAndOption.map((q, idx) => (
                  <PassageMultipleChoiceComponent
                    key={q.rqId || idx}
                    mulptipleQuizz={q}
                    questionNumber={14 + idx}
                    selectedAnswer={answers[q.rqId]}
                    onAnswerChange={handleAnswerChange}
                    submitted={submitted}
                    showExplanation={showAllExplanations}
                  />
                ))}
              </div>

              {/* Submit/Reset Buttons - Compact */}
              <div className="mt-6 pt-4 border-t border-border-light">
                {!submitted ? (
                  <button
                    onClick={handleSubmitAll}
                    disabled={!allAnswered}
                    className={`w-full py-2 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
                      allAnswered
                        ? "bg-primary-30 hover:bg-primary-dark shadow-sm hover:shadow-md"
                        : "bg-border-dark text-text-muted cursor-not-allowed"
                    }`}
                  >
                    {allAnswered ? (
                      <span className="flex items-center justify-center gap-1">
                        📝 Submit Answers
                      </span>
                    ) : (
                      `Complete All Questions (${answeredCount}/${totalQuestions})`
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Result Summary - Compact */}
                    <div className={`p-3 rounded-lg border text-center ${
                      numTrueAns >= totalQuestions * 0.6
                        ? "bg-status-completed/10 border-status-completed"
                        : "bg-accent-10/10 border-accent-10"
                    }`}>
                      <p className={`text-base font-bold mb-1 ${
                        numTrueAns >= totalQuestions * 0.6 ? "text-status-completed" : "text-accent-10"
                      }`}>
                        {numTrueAns >= totalQuestions * 0.6 ? "🎉 Great Job!" : "📚 Keep Learning"}
                      </p>
                      <p className="text-xs text-text-primary">
                        <span className="font-bold">{numTrueAns}</span> of <span className="font-bold">{totalQuestions}</span> correct
                        <span className="text-text-secondary ml-1">
                          ({Math.round((numTrueAns / totalQuestions) * 100)}%)
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons - Compact */}
                    <div className="grid gri2d-cols-2 gap-">
                      <button
                        onClick={handleReset}
                        className="py-2 rounded-lg font-medium text-primary-30 border border-primary-30 hover:bg-primary-30/10 transition-all duration-200 text-xs flex items-center justify-center gap-1"
                      >
                        <span>↻</span>
                        Try Again
                      </button>
                      
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 flex flex-col gap-3 z-50">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-primary-30 text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 animate-bounce-gentle"
            title="Scroll to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* Scroll to Passage Button */}
        {/* <button
          onClick={scrollToPassage}
          className="bg-accent-10 text-white p-3 rounded-full shadow-lg hover:bg-accent-dark transition-all duration-300"
          title="Scroll to passage"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button> */}

        {/* Quick Review Button - Only show after submit
        {submitted && (
          <button
            onClick={handleShowAllExplanations}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              showAllExplanations
                ? "bg-status-completed text-white"
                : "bg-white text-primary-30 border border-primary-30"
            }`}
            title={showAllExplanations ? "Hide all explanations" : "Show all explanations"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )} */}
      </div>

      {/* Floating Progress Indicator for mobile - Compact */}
      {!submitted && (
        <div className="fixed bottom-4 right-4 sm:hidden z-10">
          <div className="bg-primary-30 text-white px-3 py-2 rounded-lg shadow-card">
            <div className="text-center">
              <div className="text-xs font-bold">{answeredCount}/{totalQuestions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}