import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';

const QuestionPanel = ({ onAnswerChange }) => {
  const { 
    getCurrentQuestion, 
    getAnswer, 
    setAnswer,
    currentQuestionIndex,
    questions 
  } = useExam();

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getAnswer(currentQuestionIndex);

  useEffect(() => {
    setSelectedAnswer(currentAnswer);
  }, [currentQuestionIndex, currentAnswer]);

  const handleAnswerChange = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setAnswer(currentQuestionIndex, optionIndex);
    onAnswerChange && onAnswerChange(optionIndex);
  };

  if (!currentQuestion) {
    return <div className="question-panel">Loading question...</div>;
  }

  return (
    <div className="question-panel">
      <div className="question-header">
        <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
      </div>
      
      <div className="question-content">
        <div className="question-text">
          {currentQuestion.question}
        </div>
        
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={() => handleAnswerChange(index)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>
      

    </div>
  );
};

export default QuestionPanel;
