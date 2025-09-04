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
            placeholder="Enter Exam ID (try 'test' for demo)"
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
          <p>Since the backend is not connected, the app will automatically use mock data for testing.</p>
          <p><strong>Try these exam IDs:</strong></p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li><code>test</code> - Sample exam with 5 questions</li>
            <li><code>mock</code> - Same sample exam</li>
            <li>Any other ID will show an error</li>
          </ul>
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
