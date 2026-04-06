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

async function triggerRetrain() {
  const { data } = await mlApi.post('/train');
  return data;
}

async function getRetrainStatus() {
  const { data } = await mlApi.get('/retrain-status');
  return data;
}

module.exports = { predictScore, getModelMetrics, triggerRetrain, getRetrainStatus };
