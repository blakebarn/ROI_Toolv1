import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import calculationsRouter from './routes/calculations.js';
import knowledgeBaseRouter from './routes/knowledgeBase.js';
import exportsRouter from './routes/exports.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/calculations', calculationsRouter);
app.use('/api/knowledge-base', knowledgeBaseRouter);
app.use('/api/exports', exportsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`ROI Tool API running on http://localhost:${PORT}`);
});
