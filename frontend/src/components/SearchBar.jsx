import { Box, TextField, Button, Stack, Paper, Typography, Alert } from '@mui/material';
import { useState } from 'react';

const SearchBar = ({ onSearch, onGeoLocate }) => {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!query.trim() || !startDate || !endDate) {
      setError('Please fill in all fields before searching.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be later than end date.');
      return;
    }

    setError('');
    onSearch(query, startDate, endDate);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        px: 4,
        py: 3,
        mx: 'auto',
        maxWidth: '1000px',
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        borderRadius: 3,
        mb: 4,
      }}
    >
      

      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        mt={2}
      >
        <TextField
          label="Enter City / ZIP / Landmark / Coords"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 250, flexGrow: 1 }}
          size="small"
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
          size="small"
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ minWidth: 120, whiteSpace: 'nowrap' }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          onClick={onGeoLocate}
          sx={{ minWidth: 150, whiteSpace: 'nowrap' }}
        >
          Use My Location
        </Button>
      </Stack>

      {error && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default SearchBar;
