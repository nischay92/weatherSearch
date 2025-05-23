import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchWeather = async (location, startDate, endDate) => {
  const res = await axios.post(API_BASE, {
    location,
    startDate,
    endDate,
  });
  return res.data;
};

export const getSavedWeather = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};
export const fetchForecast = async (lat, lon) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE}/forecast`, {
    params: { lat, lon },
  });
  return res.data.forecast;
};
export const fetchForecastByRange = async (lat, lon, start, end) => {
  const res = await axios.get(`${API_BASE}/forecast/range`, {
    params: { lat, lon, start, end },
  });
  return res.data.forecast;
};

export const deleteWeather = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const updateWeather = async (id, updatedFields) => {
  const res = await axios.put(`${API_BASE}/${id}`, updatedFields);
  return res.data;
};

export const exportWeather = async (format = 'json') => {
  const res = await axios.get(`${API_BASE}/export/${format}`);
  return res.data;
};