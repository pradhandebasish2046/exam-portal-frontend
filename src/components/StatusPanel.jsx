import React from 'react';
import { useExam } from '../context/ExamContext';

const StatusPanel = () => {
  const { getExamStats } = useExam();
  const stats = getExamStats();
  
  // Debug logging
  console.log('Status Panel Stats:', stats);

  return (
    <div className="status-panel">
      <h4>Exam Status</h4>
      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">Total Questions:</span>
          <span className="status-value">{stats.total}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Not Visited:</span>
          <span className="status-value not-visited">{stats.notVisited}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Not Answered:</span>
          <span className="status-value not-answered">{stats.notAnswered}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Answered:</span>
          <span className="status-value answered">{stats.answered}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Marked for Review:</span>
          <span className="status-value marked">{stats.markedForReview}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Answered & Marked:</span>
          <span className="status-value answered-marked">{stats.answeredReview}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
