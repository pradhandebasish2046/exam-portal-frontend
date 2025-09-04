import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ExamContext = createContext();

// Question status constants
export const QUESTION_STATUS = {
  NOT_VISITED: 'NOT_VISITED',
  NOT_ANSWERED: 'NOT_ANSWERED',
  ANSWERED: 'ANSWERED',
  MARKED_REVIEW: 'MARKED_REVIEW',
  ANSWERED_REVIEW: 'ANSWERED_REVIEW'
};

// Initial state
const initialState = {
  examId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  questionStatus: {},
  timeSpent: {},
  examStartTime: null,
  examDuration: 90 * 60, // 90 minutes in seconds
  isExamStarted: false,
  isExamSubmitted: false,
  loading: false,
  error: null
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_EXAM_DATA: 'SET_EXAM_DATA',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_ANSWER: 'SET_ANSWER',
  SET_QUESTION_STATUS: 'SET_QUESTION_STATUS',
  UPDATE_TIME_SPENT: 'UPDATE_TIME_SPENT',
  START_EXAM: 'START_EXAM',
  SUBMIT_EXAM: 'SUBMIT_EXAM',
  RESET_EXAM: 'RESET_EXAM'
};

// Reducer function
function examReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_EXAM_DATA:
      const { examId, questions } = action.payload;
      const initialStatus = {};
      questions.forEach((q, index) => {
        initialStatus[index] = QUESTION_STATUS.NOT_VISITED;
      });
      
      return {
        ...state,
        examId,
        questions,
        questionStatus: initialStatus,
        loading: false,
        error: null
      };
    
    case ACTIONS.SET_CURRENT_QUESTION:
      const newQuestionIndex = action.payload;
      const updatedStatus = { ...state.questionStatus };
      
      // If the question is being visited for the first time, mark it as "Not Answered"
      if (updatedStatus[newQuestionIndex] === QUESTION_STATUS.NOT_VISITED) {
        updatedStatus[newQuestionIndex] = QUESTION_STATUS.NOT_ANSWERED;
      }
      
      return { 
        ...state, 
        currentQuestionIndex: newQuestionIndex,
        questionStatus: updatedStatus
      };
    
    case ACTIONS.SET_ANSWER:
      const { questionIndex, answer } = action.payload;
      const currentQuestion = state.questions[questionIndex];
      const questionId = currentQuestion ? currentQuestion.id : questionIndex;
      const newAnswers = { ...state.answers, [questionId]: answer };
      

      
      // Answer is stored, but status is managed separately by buttons
      return {
        ...state,
        answers: newAnswers
      };
    
    case ACTIONS.SET_QUESTION_STATUS:
      const { questionIndex: qIndex, status } = action.payload;
      const newQuestionStatus = { ...state.questionStatus };
      newQuestionStatus[qIndex] = status;
      
      return { ...state, questionStatus: newQuestionStatus };
    
    case ACTIONS.UPDATE_TIME_SPENT:
      return {
        ...state,
        timeSpent: { ...state.timeSpent, ...action.payload }
      };
    
    case ACTIONS.START_EXAM:
      return {
        ...state,
        isExamStarted: true,
        examStartTime: Date.now()
      };
    
    case ACTIONS.SUBMIT_EXAM:
      return {
        ...state,
        isExamSubmitted: true
      };
    
    case ACTIONS.RESET_EXAM:
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    
    setExamData: (examId, questions) => 
      dispatch({ type: ACTIONS.SET_EXAM_DATA, payload: { examId, questions } }),
    
    setCurrentQuestion: (index) => 
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: index }),
    
    setAnswer: (questionIndex, answer) => 
      dispatch({ type: ACTIONS.SET_ANSWER, payload: { questionIndex, answer } }),
    
    setQuestionStatus: (questionIndex, status) => {
      console.log('setQuestionStatus', questionIndex, status);
      
      dispatch({ type: ACTIONS.SET_QUESTION_STATUS, payload: { questionIndex, status } })
    },
    
    updateTimeSpent: (timeData) => 
      dispatch({ type: ACTIONS.UPDATE_TIME_SPENT, payload: timeData }),
    
    startExam: () => dispatch({ type: ACTIONS.START_EXAM }),
    
    submitExam: () => dispatch({ type: ACTIONS.SUBMIT_EXAM }),
    
    resetExam: () => dispatch({ type: ACTIONS.RESET_EXAM })
  };

  // Get current question
  const getCurrentQuestion = () => {
    return state.questions[state.currentQuestionIndex] || null;
  };

  // Get question status
  const getQuestionStatus = (questionIndex) => {
    return state.questionStatus[questionIndex] || QUESTION_STATUS.NOT_VISITED;
  };

  // Get answer for question
  const getAnswer = (questionIndex) => {
    const currentQuestion = state.questions[questionIndex];
    const questionId = currentQuestion ? currentQuestion.id : questionIndex;
    const answer = state.answers[questionId];
    return answer !== undefined ? answer : null;
  };

  // Check if exam is completed
  const isExamCompleted = () => {
    return state.isExamSubmitted;
  };

  // Get exam statistics
  const getExamStats = () => {
    const total = state.questions.length;
    const statusCounts = Object.values(state.questionStatus);
    
    const notVisited = statusCounts.filter(status => status === QUESTION_STATUS.NOT_VISITED).length;
    const notAnswered = statusCounts.filter(status => status === QUESTION_STATUS.NOT_ANSWERED).length;
    const answered = statusCounts.filter(status => status === QUESTION_STATUS.ANSWERED).length;
    const markedForReview = statusCounts.filter(status => status === QUESTION_STATUS.MARKED_REVIEW).length;
    const answeredReview = statusCounts.filter(status => status === QUESTION_STATUS.ANSWERED_REVIEW).length;
    
    return {
      total,
      notVisited,
      notAnswered,
      answered,
      markedForReview,
      answeredReview
    };
  };

  const value = {
    ...state,
    ...actions,
    getCurrentQuestion,
    getQuestionStatus,
    getAnswer,
    isExamCompleted,
    getExamStats
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
}

// Custom hook to use exam context
export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
