import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useExam, QUESTION_STATUS } from '../context/ExamContext';
import { mockAPI } from '../utils/mockData';
import QuestionPanel from '../components/QuestionPanel';
import QuestionNavigation from '../components/QuestionNavigation';
import StatusPanel from '../components/StatusPanel';
import Controls from '../components/Controls';
import Timer from '../components/Timer';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { 
    examId: contextExamId,
    questions, 
    loading, 
    error, 
    setExamData, 
    setCurrentQuestion, 
    setLoading, 
    setError,
    startExam,
    isExamStarted,
    currentQuestionIndex,
    answers,
    timeSpent,
    updateTimeSpent,
    submitExam,
    getAnswer,
    setQuestionStatus,
    getQuestionStatus
  } = useExam();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(null);
  const loadingRef = useRef(false);

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      if (contextExamId === examId && questions.length > 0) {
        return; // Already loaded
      }

      if (loadingRef.current) {
        return; // Already loading
      }

      loadingRef.current = true;
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mock-api.example.com/api';
      
      // If using mock API URL, use mock data directly
      if (API_BASE_URL === 'https://mock-api.example.com/api') {
        console.log('Using mock data for exam loading...');
        try {
          const mockResponse = await mockAPI.getExam(examId);
          console.log('Using mock data:', mockResponse.data);
          setExamData(examId, mockResponse.data.questions);
          startExam();
        } catch (mockErr) {
          console.error('Mock data failed:', mockErr);
          setError(`Demo mode error: ${mockErr.message}. Please try refreshing the page.`);
        } finally {
          loadingRef.current = false;
        }
        return;
      }
      
      try {
        const response = await axios.get(`${API_BASE_URL}/exam/${examId}`);
        console.log('API Response:', response.data);
        console.log('Questions array:', response.data.questions);
        console.log('Questions type:', typeof response.data.questions);
        console.log('Is array:', Array.isArray(response.data.questions));
        
        if (!response.data.questions) {
          throw new Error('No questions found in response');
        }
        
        setExamData(examId, response.data.questions);
        startExam();
      } catch (err) {
        console.error('Error loading exam:', err);
        
        // If it's a network error or 404, try using mock data
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || err.response?.status === 404) {
          console.log('API unavailable, using mock data for demo...');
          try {
            const mockResponse = await mockAPI.getExam(examId);
            console.log('Using mock data:', mockResponse.data);
            setExamData(examId, mockResponse.data.questions);
            startExam();
            return;
          } catch (mockErr) {
            console.error('Mock data also failed:', mockErr);
            // Even if mock data fails, show a helpful error
            setError(`Demo mode error: ${mockErr.message}. Please try refreshing the page.`);
            return;
          }
        }
        
        setError(err.response?.data?.detail || err.message || 'Failed to load exam');
      } finally {
        loadingRef.current = false;
      }
    };

    loadExam();
  }, [examId, contextExamId]);

  // Track time spent on current question
  useEffect(() => {
    if (isExamStarted && questions.length > 0) {
      // Save time spent on previous question before switching
      if (currentQuestionStartTime && currentQuestionIndex >= 0) {
        const timeSpentOnCurrent = (Date.now() - currentQuestionStartTime) / 1000;
        const currentTime = timeSpent[currentQuestionIndex] || 0;
        updateTimeSpent({ [currentQuestionIndex]: currentTime + timeSpentOnCurrent });
      }
      
      // Start timer for new question
      setCurrentQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, isExamStarted, questions.length]);

  const handleQuestionSelect = (questionIndex) => {
    // Save time spent on current question before switching
    if (currentQuestionStartTime && isExamStarted && currentQuestionIndex >= 0) {
      const timeSpentOnCurrent = (Date.now() - currentQuestionStartTime) / 1000;
      const currentTime = timeSpent[currentQuestionIndex] || 0;
      updateTimeSpent({ [currentQuestionIndex]: currentTime + timeSpentOnCurrent });
    }
    
    // Auto-update question status based on whether answer is selected
    const currentAnswer = getAnswer(currentQuestionIndex);
    const hasSelectedOption = currentAnswer !== null && currentAnswer !== undefined;
    const currentStatus = getQuestionStatus(currentQuestionIndex);
    
    // Update status based on current state and whether option is selected
    // But preserve MARKED_REVIEW and ANSWERED_REVIEW statuses
    console.log('handleQuestionSelect - Current status:', currentStatus, 'Has option:', hasSelectedOption, 'Question:', currentQuestionIndex);
    
    // Preserve marked statuses - don't change them when navigating
    if (currentStatus === QUESTION_STATUS.ANSWERED_REVIEW || currentStatus === QUESTION_STATUS.MARKED_REVIEW) {
      console.log('Preserving marked status:', currentStatus, 'for question:', currentQuestionIndex);
      // Don't change the status for marked questions
    } else if (currentStatus === QUESTION_STATUS.NOT_VISITED) {
      // First time visiting - set status based on whether option is selected
      if (hasSelectedOption) {
        setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.ANSWERED);
      } else {
        setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.NOT_ANSWERED);
      }
    } else if (currentStatus === QUESTION_STATUS.NOT_ANSWERED && hasSelectedOption) {
      // If previously not answered but now has an option selected, mark as answered
      setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.ANSWERED);
    } else if (currentStatus === QUESTION_STATUS.ANSWERED && !hasSelectedOption) {
      // If previously answered but now no option selected, mark as not answered
      setQuestionStatus(currentQuestionIndex, QUESTION_STATUS.NOT_ANSWERED);
    }
    
    setCurrentQuestion(questionIndex);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionSelect(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save time spent on current question before switching
      if (currentQuestionStartTime && isExamStarted && currentQuestionIndex >= 0) {
        const timeSpentOnCurrent = (Date.now() - currentQuestionStartTime) / 1000;
        const currentTime = timeSpent[currentQuestionIndex] || 0;
        updateTimeSpent({ [currentQuestionIndex]: currentTime + timeSpentOnCurrent });
      }
      
      // Move to next question without processing current question status
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmit();
  };

  const handleSubmit = async () => {
    let submissionData = null;
    
    try {
      // Save time spent on current question
      if (currentQuestionStartTime && isExamStarted && currentQuestionIndex >= 0) {
        const timeSpentOnCurrent = (Date.now() - currentQuestionStartTime) / 1000;
        const currentTime = timeSpent[currentQuestionIndex] || 0;
        updateTimeSpent({ [currentQuestionIndex]: currentTime + timeSpentOnCurrent });
      }

      const userId = `user_${Date.now()}`; // Generate a simple user ID
      const totalTime = parseFloat(Object.values(timeSpent).reduce((sum, time) => sum + time, 0));

      // Convert timeSpent keys from question indices to question IDs
      const timeSpentWithQuestionIds = {};
      Object.keys(timeSpent).forEach(index => {
        const questionIndex = parseInt(index);
        const question = questions[questionIndex];
        if (question && question.id) {
          // Ensure time_spent values are floats
          timeSpentWithQuestionIds[parseInt(question.id)] = parseFloat(timeSpent[index]) || 0;
        }
      });

      // Convert answers keys from strings to integers and ensure answer values are integers
      const answersWithIntKeys = {};
      Object.keys(answers).forEach(key => {
        const intKey = parseInt(key);
        const answerValue = answers[key];
        // Ensure answer value is an integer (0, 1, 2, 3)
        if (answerValue !== null && answerValue !== undefined) {
          answersWithIntKeys[intKey] = parseInt(answerValue);
        }
      });

      submissionData = {
        user_id: userId,
        answers: answersWithIntKeys,
        time_spent: timeSpentWithQuestionIds,
        total_time: totalTime
      };

      // Debug logging
      console.log('Submission data:', submissionData);
      console.log('Answers types:', Object.entries(answersWithIntKeys).map(([k, v]) => [typeof k, typeof v]));
      console.log('Time spent types:', Object.entries(timeSpentWithQuestionIds).map(([k, v]) => [typeof k, typeof v]));

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mock-api.example.com/api';
      let response;
      
      // If using mock API URL, use mock data directly
      if (API_BASE_URL === 'https://mock-api.example.com/api') {
        console.log('Using mock data for submission...');
        response = await mockAPI.submitExam(examId, submissionData);
      } else {
        try {
          response = await axios.post(`${API_BASE_URL}/exam/${examId}/submit`, submissionData);
        } catch (err) {
          // If it's a network error or 404, try using mock data
          if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || err.response?.status === 404) {
            console.log('API unavailable on submit, using mock data...');
            response = await mockAPI.submitExam(examId, submissionData);
          } else {
            throw err;
          }
        }
      }
      
      // Store user ID in localStorage for result retrieval
      localStorage.setItem(`exam_${examId}_user`, userId);
      
      // Navigate to result page
      navigate(`/result/${examId}/${userId}`);
    } catch (err) {
      console.error('Failed to submit exam:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error detail:', err.response?.data?.detail);
      console.error('Submission data that failed:', submissionData);
      alert('Failed to submit exam. Please try again.');
    }
  };

  const confirmSubmit = () => {
    setShowSubmitModal(true);
  };

  const finalSubmit = () => {
    setShowSubmitModal(false);
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="exam-page loading">
        <div className="loading-spinner">Loading exam...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-page error">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-page">
      {/* Header */}
      <div className="exam-header">
        <div className="exam-title">
          <h2>Physics Test – 90 min</h2>
        </div>
        <Timer onTimeUp={handleTimeUp} />
      </div>

      {/* Main Content */}
      <div className="exam-content">
        {/* Left Panel - Question */}
        <div className="question-section">
          <QuestionPanel />
          <Controls 
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={confirmSubmit}
          />
        </div>

        {/* Right Panel - Navigation & Status */}
        <div className="navigation-section">
          <StatusPanel />
          <QuestionNavigation onQuestionSelect={handleQuestionSelect} />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit your exam? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={finalSubmit}>
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
