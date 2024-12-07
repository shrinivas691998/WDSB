import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { router as demandRouter } from './routes/demand';
import { router as supplyRouter } from './routes/supply';
import { router as bomRouter } from './routes/bom';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/api/demand', demandRouter);
app.use('/api/supply', supplyRouter);
app.use('/api/bom', bomRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 