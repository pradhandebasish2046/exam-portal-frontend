import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useExam, QUESTION_STATUS } from '../context/ExamContext';

const Controls = ({ onPrevious, onNext, onSubmit }) => {
  const { 
    currentQuestionIndex, 
    questions, 
    getAnswer, 
    setAnswer, 
    setQuestionStatus,
    getQuestionStatus
  } = useExam();

  const [buttonFeedback, setButtonFeedback] = useState(null);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = getAnswer(currentQuestionIndex);
  const hasSelectedOption = currentAnswer !== null && currentAnswer !== undefined;
  const currentStatus = getQuestionStatus(currentQuestionIndex);

  // Reset button feedback when question changes
  useEffect(() => {
    setButtonFeedback(null);
  }, [currentQuestionIndex]);

  const handleSaveAndNext = () => {
    if (hasSelectedOption) {
      // Save the answer as Answered, go to next question
      setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.ANSWERED);
    } else {
      // Mark as Not Answered, go to next question
      setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.NOT_ANSWERED);
    }
    onNext();
  };



  const handleMarkForReviewAndNext = () => {
    const newStatus = hasSelectedOption ? QUESTION_STATUS.ANSWERED_REVIEW : QUESTION_STATUS.MARKED_REVIEW;
    
    console.log('Mark for Review clicked:', {
      currentQuestionIndex,
      hasSelectedOption,
      currentAnswer,
      newStatus,
      currentStatus
    });
    
    // Set visual feedback based on whether option is selected
    if (hasSelectedOption) {
      setButtonFeedback('answered-marked'); // Green with purple border
    } else {
      setButtonFeedback('marked-for-review'); // Red with purple border
    }
    
    // Use flushSync to ensure the status update is synchronous
    flushSync(() => {
      setQuestionStatus(currentQuestionIndex, newStatus);
    });
    
    // Clear feedback after a short delay and move to next question
    setTimeout(() => {
      setButtonFeedback(null);
      onNext();
    }, 500);
  };

  const handleClearResponse = () => {
    setAnswer(currentQuestionIndex, null);
    // Status should update to Not Answered
    setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.NOT_ANSWERED);
  };



  return (
    <div className="controls">
      <div className="question-controls">
        <button 
          className="btn btn-primary"
          onClick={handleSaveAndNext}
        >
          Save & Next
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleClearResponse}
        >
          Clear Response
        </button>
        
        <button 
          className={`btn btn-info ${buttonFeedback ? `btn-${buttonFeedback}` : ''}`}
          onClick={handleMarkForReviewAndNext}
        >
          Mark for Review & Next
        </button>
      </div>
      
      {/* Current question status indicator */}
      <div className="current-status">
        <span className="status-label">Current Status: </span>
        <span className={`status-indicator ${currentStatus.toLowerCase().replace('_', '-')}`}>
          {currentStatus === QUESTION_STATUS.ANSWERED_REVIEW ? 'Answered & Marked' :
           currentStatus === QUESTION_STATUS.MARKED_REVIEW ? 'Marked for Review' :
           currentStatus === QUESTION_STATUS.ANSWERED ? 'Answered' :
           currentStatus === QUESTION_STATUS.NOT_ANSWERED ? 'Not Answered' :
           'Not Visited'}
        </span>
      </div>

      <div className="navigation-controls">
        <button 
          className="btn btn-outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
        >
          ← Back
        </button>
        
        <button 
          className="btn btn-outline"
          onClick={onNext}
          disabled={isLastQuestion}
        >
          Next →
        </button>
      </div>
      
      <div className="submit-control">
        <button 
          className="btn btn-success btn-large"
          onClick={onSubmit}
        >
          Submit Exam
        </button>
      </div>


    </div>
  );
};

export default Controls;
