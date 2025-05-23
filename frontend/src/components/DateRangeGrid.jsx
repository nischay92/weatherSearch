import { Box, Card, CardContent, Typography } from '@mui/material';

const DateRangeGrid = ({ forecast }) => {
  return (
    <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
      {forecast.map((day, idx) => (
        <Card key={idx} sx={{ width: 150 }}>
          <CardContent>
            <Typography variant="subtitle2" align="center">
              {day.date}
            </Typography>
            <Box display="flex" justifyContent="center" mt={1}>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
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
  );
};

export default DateRangeGrid;
