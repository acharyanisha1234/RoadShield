const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: '🛡️ RoadShield API running' }));
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;