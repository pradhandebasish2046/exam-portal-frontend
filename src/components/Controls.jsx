import React from 'react';
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

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = getAnswer(currentQuestionIndex);
  const hasSelectedOption = currentAnswer !== null && currentAnswer !== undefined;

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
    console.log('Mark for Review clicked:', {
      currentQuestionIndex,
      hasSelectedOption,
      currentAnswer,
      status: hasSelectedOption ? 'ANSWERED_REVIEW' : 'MARKED_REVIEW'
    });
    
    // Use flushSync to ensure the status update is synchronous
    flushSync(() => {
      if (hasSelectedOption) {
        // Save the answer as Answered & Marked for Review, go to next question
        setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.ANSWERED_REVIEW);
      } else {
        // Mark as Marked for Review (red with purple border), go to next question
        setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.MARKED_REVIEW);
      }
    });
    
    onNext();
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
          className="btn btn-info"
          onClick={handleMarkForReviewAndNext}
        >
          Mark for Review & Next
        </button>
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
