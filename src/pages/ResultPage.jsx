import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mockAPI } from '../utils/mockData';

const ResultPage = () => {
  const { examId, userId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (loading) {
        return; // Already loading
      }

      setLoading(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mock-api.example.com/api';
        const response = await axios.get(`${API_BASE_URL}/result/${examId}/${userId}`);
        setResult(response.data);
      } catch (err) {
        // If it's a network error or 404, try using mock data
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || err.response?.status === 404) {
          console.log('API unavailable on result fetch, using mock data...');
          try {
            const mockResponse = await mockAPI.getResult(examId, userId);
            setResult(mockResponse.data);
          } catch (mockErr) {
            setError('Demo mode unavailable. Please try again later.');
          }
        } else {
          setError(err.response?.data?.detail || 'Failed to load result');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, userId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4CAF50'; // Green
    if (percentage >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  if (loading) {
    return (
      <div className="result-page loading">
        <div className="loading-spinner">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page error">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page">
        <div className="no-result">
          <h2>No Result Found</h2>
          <p>The exam result could not be found.</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <h1>Exam Results</h1>
          <div className="exam-info">
            <p><strong>Exam ID:</strong> {result.exam_id}</p>
            <p><strong>Submitted:</strong> {new Date(result.submitted_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="result-summary">
          <div className="score-card">
            <div 
              className="score-circle"
              style={{ borderColor: getScoreColor(result.score, result.total_questions) }}
            >
              <div className="score-number">{result.score}</div>
              <div className="score-total">/{result.total_questions}</div>
            </div>
            <div className="score-percentage">
              {Math.round((result.score / result.total_questions) * 100)}%
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{result.attempted}</div>
              <div className="stat-label">Attempted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{result.correct}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{result.incorrect}</div>
              <div className="stat-label">Incorrect</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{result.total_questions - result.attempted}</div>
              <div className="stat-label">Unattempted</div>
            </div>
          </div>
        </div>

        <div className="time-analysis">
          <h3>Time Analysis</h3>
          <div className="time-table">
            <div className="time-header">
              <div>Question</div>
              <div>Time Spent</div>
            </div>
            {Object.entries(result.time_spent).map(([questionId, time]) => (
              <div key={questionId} className="time-row">
                <div>Question {parseInt(questionId) + 1}</div>
                <div>{formatTime(time)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Take Another Exam
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
