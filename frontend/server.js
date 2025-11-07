const express = require('express');
const path = require('path');

// Try to import axios, but don't fail if it's not available
let axios;
try {
  axios = require('axios');
} catch (e) {
  console.log('Axios not available, using fallback');
  axios = null;
}

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

// Middleware
app.use(express.static('dist'));
app.use(express.json());

// API route to proxy requests to backend
app.get('/api/health', async (req, res) => {
  if (!axios) {
    return res.json({ error: 'Axios not available, backend communication disabled' });
  }
  
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Backend service unavailable' });
  }
});

// Serve main HTML file
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Frontend Application</title>
        <link rel="stylesheet" href="/style.css">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            button { padding: 10px 20px; margin: 10px 0; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            #health-status { margin-top: 20px; padding: 10px; border-radius: 4px; }
            .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        </style>
    </head>
    <body>
        <h1>Frontend Application</h1>
        <div id="app">
            <p>Welcome to the Dockerized Application Stack!</p>
            <button onclick="checkBackendHealth()">Check Backend Health</button>
            <button onclick="testPrediction()">Test Prediction API</button>
            <div id="health-status"></div>
        </div>
        <script src="/app.js"></script>
        <script>
            async function checkBackendHealth() {
                const statusDiv = document.getElementById('health-status');
                statusDiv.innerHTML = '<p>Checking backend health...</p>';
                try {
                    const response = await fetch('/api/health');
                    const data = await response.json();
                    statusDiv.innerHTML = '<div class="success">Backend Status: ' + data.status + '<br>TensorFlow Available: ' + data.tensorflow_available + '<br>Version: ' + data.tensorflow_version + '</div>';
                } catch (error) {
                    statusDiv.innerHTML = '<div class="error">Backend Status: Error - ' + error.message + '</div>';
                }
            }
            
            async function testPrediction() {
                const statusDiv = document.getElementById('health-status');
                statusDiv.innerHTML = '<p>Testing prediction API...</p>';
                try {
                    const response = await fetch('http://backend:8000/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: [1, 2, 3, 4, 5] })
                    });
                    const data = await response.json();
                    statusDiv.innerHTML = '<div class="success">Prediction Result: ' + JSON.stringify(data, null, 2) + '</div>';
                } catch (error) {
                    statusDiv.innerHTML = '<div class="error">Prediction Error: ' + error.message + '</div>';
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'frontend', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
});