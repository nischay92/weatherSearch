import axios from 'axios';
import dotenv from 'dotenv';
import resolveLocation from './fuzzyLocationResolver.js';

dotenv.config();

const fetchWeatherData = async (input) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const { lat, lon, name } = await resolveLocation(input);

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const { data } = await axios.get(url);

  return {
    ...data,
    resolvedName: name,
  };
};

export default fetchWeatherData;
