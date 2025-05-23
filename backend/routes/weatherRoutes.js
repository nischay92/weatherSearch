import express from 'express';
import {
  createWeather,
  getAllWeather,
  updateWeather,
  deleteWeather,
  exportWeather,
  getForecast,
  getForecastByRange,
} from '../controllers/weatherController.js';

const router = express.Router();

router.post('/', createWeather);
router.get('/', getAllWeather);
router.put('/:id', updateWeather);
router.delete('/:id', deleteWeather);
router.get('/export/:format', exportWeather);
router.get('/forecast', getForecast);
router.get('/forecast/range', getForecastByRange);

export default router;
