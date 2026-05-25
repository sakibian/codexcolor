const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Clean URL routing - remove .html extension
app.get('/roi-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'roi-calculator.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

app.get('/terms-of-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 CodexColor server running at http://localhost:${PORT}`);
  console.log(`📊 ROI Calculator: http://localhost:${PORT}/roi-calculator`);
  console.log(`🏠 Homepage: http://localhost:${PORT}`);
});
