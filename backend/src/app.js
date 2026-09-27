const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const pythonService = require('./services/pythonService');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: '🛡️ RoadShield API running' }));

app.get('/ai-health', async (req, res) => {
  const healthy = await pythonService.isAiHealthy();
  res.json({
    ai_service: healthy ? 'healthy' : 'unreachable',
    ai_url: process.env.PYTHON_API_URL || 'http://localhost:8000',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;