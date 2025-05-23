import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  location: String,
  coords: {
    lat: Number,
    lon: Number,
  },
  dateRange: {
    start: Date,
    end: Date,
  },
  weatherData: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Weather', weatherSchema);
