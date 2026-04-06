const axios = require('axios');

const mlApi = axios.create({
  baseURL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  timeout: 10000,
});

async function predictScore(payload) {
  const { data } = await mlApi.post('/predict', payload);
  return data;
}

async function getModelMetrics() {
  const { data } = await mlApi.get('/model-metrics');
  return data;
}

module.exports = { predictScore, getModelMetrics };
