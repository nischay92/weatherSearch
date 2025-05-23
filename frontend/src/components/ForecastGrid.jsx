import { Box, Card, CardContent, Typography } from '@mui/material';

const ForecastGrid = ({ forecast }) => {
  return (
    <Box
      mt={2}
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      gap={2}
    >
      {forecast.map((day, idx) => (
        <Card
          key={idx}
          sx={{
            width: 160,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" align="center" gutterBottom>
              {day.date}
            </Typography>

            <Box display="flex" justifyContent="center" mt={1}>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                style={{ width: 60 }}
              />
            </Box>

            <Typography variant="body2" align="center" mt={1}>
              {day.temp} °C
            </Typography>

            <Typography variant="caption" align="center" display="block">
              {day.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ForecastGrid;
