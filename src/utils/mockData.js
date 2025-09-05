// Mock data for testing the frontend without a backend
export const mockExamData = {
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: 2 // Paris is correct (index 2)
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: 1 // Mars is correct (index 1)
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: 1 // 4 is correct (index 1)
    },
    {
      id: 4,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      answer: 1 // William Shakespeare is correct (index 1)
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      answer: 3 // Pacific is correct (index 3)
    }
  ]
};

// Storage for mock submissions
const mockSubmissions = new Map();

// Function to calculate score based on answers
const calculateScore = (answers) => {
  let correct = 0;
  let attempted = 0;
  
  Object.entries(answers).forEach(([questionId, userAnswer]) => {
    const question = mockExamData.questions.find(q => q.id === parseInt(questionId));
    if (question && userAnswer !== null && userAnswer !== undefined) {
      attempted++;
      if (userAnswer === question.answer) {
        correct++;
      }
    }
  });
  
  return { correct, attempted, incorrect: attempted - correct };
};

// Mock API functions
export const mockAPI = {
  getExam: async (examId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any exam ID for demo purposes
    console.log('Mock API: Loading exam with ID:', examId);
    return { data: mockExamData };
  },
  
  submitExam: async (examId, submissionData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate actual score based on answers
    const { correct, attempted, incorrect } = calculateScore(submissionData.answers || {});
    
    // Store the submission data
    const submissionKey = `${examId}_${submissionData.user_id}`;
    const submissionDataToStore = {
      exam_id: examId,
      user_id: submissionData.user_id,
      answers: submissionData.answers || {},
      time_spent: submissionData.time_spent || {},
      total_time: submissionData.total_time || 0,
      score: correct,
      total_questions: mockExamData.questions.length,
      attempted,
      correct,
      incorrect,
      submitted_at: new Date().toISOString()
    };
    
    console.log('Mock API: Storing submission with key', submissionKey);
    console.log('Mock API: Submission data', submissionDataToStore);
    mockSubmissions.set(submissionKey, submissionDataToStore);
    console.log('Mock API: Total submissions stored', mockSubmissions.size);
    
    return {
      data: {
        message: "Exam submitted successfully",
        result_link: `/result/${examId}/${submissionData.user_id}`,
        score: correct,
        total_questions: mockExamData.questions.length
      }
    };
  },
  
  getResult: async (examId, userId) => {
    console.log('Mock API: Getting result for', examId, userId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const submissionKey = `${examId}_${userId}`;
    console.log('Mock API: Looking for submission key', submissionKey);
    console.log('Mock API: Available submissions', Array.from(mockSubmissions.keys()));
    
    const submission = mockSubmissions.get(submissionKey);
    
    if (!submission) {
      console.error('Mock API: No submission found for key', submissionKey);
      // Create a fallback result for demo purposes
      const fallbackResult = {
        exam_id: examId,
        user_id: userId,
        answers: {},
        time_spent: {},
        total_time: 0,
        score: 0,
        total_questions: mockExamData.questions.length,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        submitted_at: new Date().toISOString()
      };
      console.log('Mock API: Using fallback result', fallbackResult);
      return { data: fallbackResult };
    }
    
    console.log('Mock API: Found submission', submission);
    return { data: submission };
  }
};
