import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <ExamProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/exam/:examId" element={<ExamPage />} />
            <Route path="/result/:examId/:userId" element={<ResultPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </ExamProvider>
  );
}

// Simple home page component
function HomePage() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Online Exam Portal</h1>
        <p>Welcome to the Online Exam Portal. Enter an exam ID to start your exam.</p>
        
        <div className="exam-input">
          <input 
            type="text" 
            placeholder="Enter Exam ID (e.g., abc123)"
            id="examIdInput"
          />
          <button 
            onClick={() => {
              const examId = document.getElementById('examIdInput').value.trim();
              if (examId) {
                window.location.href = `/exam/${examId}`;
              } else {
                alert('Please enter a valid exam ID');
              }
            }}
          >
            Start Exam
          </button>
        </div>
        
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>⏰ Real-time countdown timer</li>
            <li>📝 Question navigation and status tracking</li>
            <li>💾 Auto-save functionality</li>
            <li>🔄 Mark questions for review</li>
            <li>📊 Detailed result analysis</li>
            <li>⏱️ Time tracking per question</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
