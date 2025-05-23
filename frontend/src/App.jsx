import { Typography, Stack, Button, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';
import SavedWeatherList from './components/SavedWeatherList';
import DateRangeGrid from './components/DateRangeGrid';

import {
  fetchWeather,
  fetchForecast,
  fetchForecastByRange,
  getSavedWeather,
  deleteWeather,
  updateWeather,
} from './api';

function App() {
  const [weather, setWeather] = useState(null);
  const [fullForecast, setFullForecast] = useState([]);
  const [rangeForecast, setRangeForecast] = useState([]);
  const [error, setError] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const data = await getSavedWeather();
      setSavedEntries(data);
    } catch (err) {
      console.error('Failed to load saved entries:', err.message);
    }
  };

  const handleSearch = async (locationInput, startDate, endDate) => {
    try {
      setError(null);
      const data = await fetchWeather(locationInput, startDate, endDate);
      const today = new Date().toISOString().split('T')[0];
      data.date = today;
      setWeather(data);

      const { lat, lon } = data.coords;
      const range = await fetchForecastByRange(lat, lon, startDate, endDate);
      setRangeForecast(range);

      const full = await fetchForecast(lat, lon);
      setFullForecast(full);

      loadSaved();
    } catch (err) {
      console.error('Fetch failed:', err.message);
      setError('Weather not found or Failed to fetch data.');
      setWeather(null);
      setRangeForecast([]);
      setFullForecast([]);
    }
  };

  const handleGeoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
          const today = new Date().toISOString().split('T')[0];
          handleSearch(coords, today, today);
        },
        () => setError('Unable to access your location.')
      );
    }
  };

  const handleDelete = async (id) => {
    await deleteWeather(id);
    loadSaved();
  };

  const handleEdit = (entry) => {
    const updated = prompt('Update location:', entry.location);
    if (updated && updated !== entry.location) {
      updateWeather(entry._id, { location: updated }).then(loadSaved);
    }
  };

  return (
  <Box
    sx={{
      minHeight: '100vh',
      px: { xs: 2, md: 4 },
      py: 4,
      backgroundColor: 'var(--bg-color, #f4f9fd)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        mb: 4,
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        p: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Weather Search
      </Typography>
      <SearchBar onSearch={handleSearch} onGeoLocate={handleGeoLocate} />
    </Box>

    <Stack direction="row" justifyContent="center" spacing={2} mb={3}>
      <Button
        variant="outlined"
        href={`${import.meta.env.VITE_API_BASE}/export/json`}
        target="_blank"
      >
        Export JSON
      </Button>
      <Button
        variant="outlined"
        href={`${import.meta.env.VITE_API_BASE}/export/csv`}
        target="_blank"
      >
        Export CSV
      </Button>
    </Stack>

    {error && (
      <Typography color="error" align="center" mb={2}>
        {error}
      </Typography>
    )}

    {weather && (
      <Box mb={4} width="100%" display="flex" justifyContent="center">
        <WeatherCard data={weather} />
      </Box>
    )}

    {rangeForecast.length > 0 && (
      <Box mt={5} width="100%">
        <Typography variant="h6" align="center" gutterBottom>
          Forecast for Selected Date Range
        </Typography>
        <DateRangeGrid forecast={rangeForecast} />
      </Box>
    )}

    {fullForecast.length > 0 && (
      <Box mt={5} width="100%">
        <Typography variant="h6" align="center" gutterBottom>
          Full 5-Day Forecast
        </Typography>
        <ForecastGrid forecast={fullForecast} />
      </Box>
    )}

    {savedEntries.length > 0 && (
      <Box mt={6} width="100%" maxWidth={1000}>
        <SavedWeatherList
          entries={savedEntries}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </Box>
    )}

    <Box
      component="footer"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mt: 8,
        px: 2,
        pb: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          bgcolor: '#ffffff',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          About this App
        </Typography>

        <Typography variant="body2" mb={2}>
          Built by <strong>Nischay Nanaiah</strong> as part of the PM Accelerator program.
        </Typography>

        <Typography variant="body2" mb={2} textAlign="justify">
          The Product Manager Accelerator Program supports PMs at all levels — from students to directors. Our community learns and develops real-world product and leadership skills through immersive training, AI projects, and expert mentorship.
        </Typography>

        <Box textAlign="left" component="ul" sx={{ pl: 2 }}>
          <li><strong>🚀 PMA Pro:</strong> FAANG-level prep, mock interviews, referrals, and offers up to $800K/year.</li>
          <li><strong>🚀 AI PM Bootcamp:</strong> Build and launch a real AI product with engineers & designers.</li>
          <li><strong>🚀 PMA Power Skills:</strong> Sharpen leadership and executive presentation skills.</li>
          <li><strong>🚀 PMA Leader:</strong> Get promoted to Director or Product Executive roles.</li>
          <li><strong>🚀 1:1 Resume Review:</strong> Create a killer PM resume with guaranteed interviews.</li>
        </Box>

        
      </Box>
    </Box>  


  </Box>
);

}

export default App;
