import Weather from '../models/weather.js';
import { Parser } from 'json2csv';
import fetchWeatherData from '../utils/fetchWeatherData.js';
import axios from 'axios';

// POST /api/weather
export const createWeather = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.body;
    if (!location || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 1: Resolve coordinates
    const resolved = await fetchWeatherData(location);
    const { resolvedName, coord } = resolved;

    // Step 2: Get current weather
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const currentWeather = {
      main: currentRes.data.main,
      weather: currentRes.data.weather,
    };

    // Step 3: Get forecast list
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const forecastList = forecastRes.data.list;

    // Step 4: Filter forecast entries for date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const dateMap = {};

    for (let d = new Date(start); d <= end; d = new Date(d.getTime() + msPerDay)) {
      const key = d.toISOString().split('T')[0];
      dateMap[key] = null;
    }

    for (const entry of forecastList) {
      const dt = new Date(entry.dt_txt);
      const key = dt.toISOString().split('T')[0];

      if (key in dateMap) {
        const prev = dateMap[key];
        const currHour = dt.getHours();
        if (!prev || Math.abs(currHour - 12) < Math.abs(new Date(prev.dt_txt).getHours() - 12)) {
          dateMap[key] = entry;
        }
      }
    }

    const forecast = Object.entries(dateMap)
      .filter(([_, entry]) => entry)
      .map(([date, entry]) => ({
        date,
        temp: entry.main.temp,
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
      }));

    // Step 5: Save entry
    const newEntry = new Weather({
      location: resolvedName,
      coords: coord,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      weatherData: {
        resolvedName,
        coord,
        current: currentWeather,
        forecast,
      },
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/weather
export const getAllWeather = async (req, res) => {
  try {
    const entries = await Weather.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/weather/:id
export const updateWeather = async (req, res) => {
  try {
    const updated = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/weather/:id
export const deleteWeather = async (req, res) => {
  try {
    await Weather.findByIdAndDelete(req.params.id);
    res.json({ message: 'Weather entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/weather/export/:format
export const exportWeather = async (req, res) => {
  try {
    const { format } = req.params;
    const entries = await Weather.find().sort({ createdAt: -1 });

    if (format === 'json') {
      return res.json(entries);
    }

    if (format === 'csv') {
      const rows = [];

      for (const entry of entries) {
        const base = {
          location: entry.location,
          lat: entry.coords?.lat,
          lon: entry.coords?.lon,
          startDate: new Date(entry.dateRange.start).toISOString().split('T')[0],
          endDate: new Date(entry.dateRange.end).toISOString().split('T')[0],
          createdAt: entry.createdAt.toISOString(),
        };

        const forecast = entry.weatherData?.forecast || [];
        if (forecast.length === 0) {
          rows.push({ ...base, forecastDate: '', temp: '', description: '', icon: '' });
        } else {
          for (const day of forecast) {
            rows.push({
              ...base,
              forecastDate: day.date,
              temp: day.temp,
              description: day.description,
              icon: day.icon,
            });
          }
        }
      }

      const fields = [
        'location',
        'lat',
        'lon',
        'startDate',
        'endDate',
        'createdAt',
        'forecastDate',
        'temp',
        'description',
        'icon',
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(rows);

      res.header('Content-Type', 'text/csv');
      res.attachment('weather_with_forecast.csv');
      return res.send(csv);
    }

    res.status(400).json({ error: 'Invalid export format. Use json or csv.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/weather/forecast
export const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const { data } = await axios.get(url);

    const dailyData = data.list.filter((_, idx) => idx % 8 === 0);

    res.json({
      city: data.city.name,
      forecast: dailyData.map(entry => ({
        date: entry.dt_txt.split(' ')[0],
        temp: entry.main.temp,
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/weather/forecast/range
export const getForecastByRange = async (req, res) => {
  try {
    const { lat, lon, start, end } = req.query;

    if (!lat || !lon || !start || !end) {
      return res.status(400).json({ error: 'lat, lon, start, and end dates are required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const { data } = await axios.get(url);

    const startDate = new Date(start);
    const endDate = new Date(end);

    const msPerDay = 24 * 60 * 60 * 1000;
    const dateMap = {};
    for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + msPerDay)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = null;
    }

    for (const entry of data.list) {
      const dt = new Date(entry.dt_txt);
      const dateKey = dt.toISOString().split('T')[0];

      if (dateKey in dateMap) {
        const current = dateMap[dateKey];
        const entryHour = dt.getHours();

        if (!current || Math.abs(entryHour - 12) < Math.abs(new Date(current.dt_txt).getHours() - 12)) {
          dateMap[dateKey] = entry;
        }
      }
    }

    const result = Object.entries(dateMap)
      .filter(([_, entry]) => entry)
      .map(([date, entry]) => ({
        date,
        temp: entry.main.temp,
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
      }));

    res.json({ forecast: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
