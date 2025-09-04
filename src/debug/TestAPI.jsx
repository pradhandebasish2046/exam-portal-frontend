import React, { useState } from 'react';
import axios from 'axios';
import { mockAPI } from '../utils/mockData';

const TestAPI = () => {
  const [examId, setExamId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    if (!examId.trim()) {
      setError('Please enter an exam ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      console.log('Testing API call to:', `${API_BASE_URL}/exam/${examId}`);
      const response = await axios.get(`${API_BASE_URL}/exam/${examId}`);
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      setResult({
        status: response.status,
        data: response.data,
        questionsType: typeof response.data.questions,
        isQuestionsArray: Array.isArray(response.data.questions),
        questionsLength: response.data.questions ? response.data.questions.length : 'N/A',
        source: 'Real API'
      });
    } catch (err) {
      console.error('API Error:', err);
      
      // If it's a network error, try mock data
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        console.log('Network error detected, trying mock data...');
        try {
          const mockResponse = await mockAPI.getExam(examId);
          setResult({
            status: 200,
            data: mockResponse.data,
            questionsType: typeof mockResponse.data.questions,
            isQuestionsArray: Array.isArray(mockResponse.data.questions),
            questionsLength: mockResponse.data.questions ? mockResponse.data.questions.length : 'N/A',
            source: 'Mock Data (API failed)'
          });
          return;
        } catch (mockErr) {
          console.error('Mock data also failed:', mockErr);
        }
      }
      
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Exam ID: 
          <input 
            type="text" 
            value={examId} 
            onChange={(e) => setExamId(e.target.value)}
            placeholder="Enter exam ID"
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
          />
        </label>
        <button 
          onClick={testAPI} 
          disabled={loading}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        <button 
          onClick={async () => {
            setExamId('test');
            await testAPI();
          }}
          disabled={loading}
          style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Test Mock Data
        </button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <h3>Error:</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4caf50', 
          padding: '10px',
          borderRadius: '4px'
        }}>
          <h3>Success:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
