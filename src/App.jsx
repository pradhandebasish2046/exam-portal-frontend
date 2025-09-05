import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import TestAPI from './debug/TestAPI';

function App() {
  return (
    <ExamProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/exam/:examId" element={<ExamPage />} />
            <Route path="/result/:examId/:userId" element={<ResultPage />} />
            <Route path="/debug" element={<TestAPI />} />
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
            placeholder="Enter any Exam ID (try 'test', 'mock', or 'd99e1923')"
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
        
        <div className="demo-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3' }}>
          <h4>🚀 Demo Mode</h4>
          <p>The app will automatically use mock data for testing when the backend is unavailable.</p>
          <p><strong>Try any exam ID:</strong></p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li><code>test</code> - Sample exam with 5 questions</li>
            <li><code>mock</code> - Same sample exam</li>
            <li><code>d99e1923</code> - Any exam ID will work in demo mode</li>
            <li><strong>Any other ID</strong> - All exam IDs work in demo mode!</li>
          </ul>
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            <strong>Note:</strong> This is a demo version. For production use, deploy the backend and set the API URL.
          </p>
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
        
        <div className="debug-link" style={{ marginTop: '20px' }}>
          <a href="/debug" style={{ color: '#666', textDecoration: 'none' }}>
            🔧 Debug API (for troubleshooting)
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
