import { Card, CardContent, Typography, Box } from '@mui/material';
import MapComponent from './MapComponent';

const WeatherCard = ({ data }) => {
  const { location, weatherData, date } = data;

  const icon = weatherData?.current?.weather?.[0]?.icon;
  const description = weatherData?.current?.weather?.[0]?.description;
  const temp = weatherData?.current?.main?.temp;
  const lat = weatherData?.coord?.lat || weatherData?.lat;
  const lon = weatherData?.coord?.lon || weatherData?.lon;

  const showMap = lat !== undefined && lon !== undefined && date;

  return (
    <Box
      mt={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ background: 'linear-gradient(180deg, #e3f2fd, #ffffff)', py: 4 }}
    >
      <Card
        sx={{
          maxWidth: 400,
          p: 2,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Weather in {location}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date: {date}
          </Typography>

          <Typography variant="body1" fontWeight={500}>
            Temp: {temp !== undefined ? `${temp} °C` : 'N/A'}
          </Typography>

          <Typography variant="body2">
            Condition: {description || 'N/A'}
          </Typography>

          {icon && (
            <Box mt={2}>
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {showMap && (
        <Box
          mt={4}
          width="100%"
          maxWidth="600px"
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0, 0, 255, 0.1)',
            backgroundColor: '#e3f2fd',
          }}
        >
          <Typography variant="subtitle1" sx={{ p: 2, textAlign: 'center' }}>
            Location on Map
          </Typography>
          <MapComponent lat={lat} lng={lon} label={location} />
        </Box>
      )}
    </Box>
  );
};

export default WeatherCard;
