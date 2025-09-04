// Mock data for testing the frontend without a backend
export const mockExamData = {
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"]
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"]
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"]
    },
    {
      id: 4,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"]
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"]
    }
  ]
};

export const mockExamResult = {
  exam_id: "mock-exam-123",
  user_id: "test-user",
  score: 4,
  total_questions: 5,
  attempted: 5,
  correct: 4,
  incorrect: 1,
  time_spent: {
    1: 30.5,
    2: 45.2,
    3: 15.8,
    4: 60.3,
    5: 25.1
  },
  submitted_at: new Date().toISOString()
};

// Mock API functions
export const mockAPI = {
  getExam: async (examId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (examId === 'test' || examId === 'mock') {
      return { data: mockExamData };
    }
    
    throw new Error('Exam not found');
  },
  
  submitExam: async (examId, submissionData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      data: {
        message: "Exam submitted successfully",
        result_link: `/result/${examId}/${submissionData.user_id}`,
        score: submissionData.answers ? Object.keys(submissionData.answers).length : 0,
        total_questions: mockExamData.questions.length
      }
    };
  },
  
  getResult: async (examId, userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { data: mockExamResult };
  }
};
