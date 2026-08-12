import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import workRoutes from './routes/workRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disabled for simplicity with React build in this demo
}));
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/work', workRoutes);

// Production Serving of React App
if (process.env.NODE_ENV === 'production') {
  // Assuming 'dist' is at the root directory of the project
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

export default app;
