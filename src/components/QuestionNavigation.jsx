import React from 'react';
import { useExam, QUESTION_STATUS } from '../context/ExamContext';

const QuestionNavigation = ({ onQuestionSelect }) => {
  const { questions, getQuestionStatus } = useExam();



  const getStatusClass = (questionIndex) => {
    const status = getQuestionStatus(questionIndex);
    
    // Debug logging for marked questions
    if (status === QUESTION_STATUS.ANSWERED_REVIEW || status === QUESTION_STATUS.MARKED_REVIEW) {
      console.log(`Question ${questionIndex + 1} status:`, status, 'Class:', 
        status === QUESTION_STATUS.ANSWERED_REVIEW ? 'answered-marked' : 'marked-for-review');
    }
    
    switch (status) {
      case QUESTION_STATUS.ANSWERED_REVIEW:
        return 'answered-marked';
      case QUESTION_STATUS.ANSWERED:
        return 'answered';
      case QUESTION_STATUS.MARKED_REVIEW:
        return 'marked-for-review';
      case QUESTION_STATUS.NOT_ANSWERED:
        return 'not-answered';
      case QUESTION_STATUS.NOT_VISITED:
      default:
        return 'not-visited';
    }
  };

  return (
    <div className="question-navigation">
      <div className="navigation-header">
        <h4>Question Navigator</h4>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color not-visited"></span>
            <span>Not Visited</span>
          </div>
          <div className="legend-item">
            <span className="legend-color not-answered"></span>
            <span>Not Answered</span>
          </div>
          <div className="legend-item">
            <span className="legend-color answered"></span>
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <span className="legend-color marked-for-review"></span>
            <span>Marked for Review</span>
          </div>
          <div className="legend-item">
            <span className="legend-color answered-marked"></span>
            <span>Answered & Marked</span>
          </div>
        </div>
      </div>
      
      <div className="question-grid">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`question-btn ${getStatusClass(index)}`}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigation;
