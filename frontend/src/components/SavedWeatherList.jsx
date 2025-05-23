import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SavedWeatherList = ({ entries, onDelete, onEdit }) => {
  return (
    <Box mt={6}>
      <Typography variant="h6" mb={2} align="center">
        Saved Weather History
      </Typography>

      <Stack spacing={4}>
        {entries.map((entry) => (
          <Card
            key={entry._id}
            sx={{
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
              p: 2,
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Box>
                  <Typography variant="subtitle1">{entry.location}</Typography>
                  <Typography variant="body2">
                    Date: {new Date(entry.dateRange.start).toLocaleDateString()} –{' '}
                    {new Date(entry.dateRange.end).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box mt={{ xs: 2, sm: 0 }}>
                  <IconButton onClick={() => onEdit(entry)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(entry._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {entry.weatherData?.forecast?.map((day, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      width: 140,
                      background: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      p: 1,
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="subtitle2" align="center">
                        {day.date}
                      </Typography>
                      <Box display="flex" justifyContent="center" mt={1}>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt={day.description}
                          style={{ width: 50 }}
                        />
                      </Box>
                      <Typography variant="body2" align="center">
                        {day.temp} °C
                      </Typography>
                      <Typography variant="caption" align="center" display="block">
                        {day.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default SavedWeatherList;
