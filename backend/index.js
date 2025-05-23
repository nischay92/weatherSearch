import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.send('Weather API is running...');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(` Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(' MongoDB connection error:', err));
