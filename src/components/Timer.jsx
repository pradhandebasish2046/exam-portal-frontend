import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';

const Timer = ({ onTimeUp }) => {
  const { examDuration, examStartTime, isExamStarted, submitExam } = useExam();
  const [timeLeft, setTimeLeft] = useState(examDuration);

  useEffect(() => {
    if (!isExamStarted || !examStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = Math.max(0, examDuration - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp();
        submitExam();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamStarted, examStartTime, examDuration, onTimeUp, submitExam]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return '#ff4444'; // Red when 5 minutes or less
    if (timeLeft <= 900) return '#ff8800'; // Orange when 15 minutes or less
    return '#333'; // Default color
  };

  return (
    <div className="timer">
      <div className="timer-icon">⏰</div>
      <div 
        className="timer-text"
        style={{ color: getTimeColor() }}
      >
        {formatTime(timeLeft)} left
      </div>
    </div>
  );
};

export default Timer;
