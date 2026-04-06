require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const mlRoutes = require('./routes/mlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    return res.json({ status: 'ok', service: 'backend' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api', mlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api', analyticsRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
