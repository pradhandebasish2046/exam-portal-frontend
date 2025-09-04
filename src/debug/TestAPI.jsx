import React, { useState } from 'react';
import axios from 'axios';

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
      console.log('Testing API call to:', `/api/exam/${examId}`);
      const response = await axios.get(`/api/exam/${examId}`);
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      setResult({
        status: response.status,
        data: response.data,
        questionsType: typeof response.data.questions,
        isQuestionsArray: Array.isArray(response.data.questions),
        questionsLength: response.data.questions ? response.data.questions.length : 'N/A'
      });
    } catch (err) {
      console.error('API Error:', err);
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
