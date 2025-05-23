import fetch from 'node-fetch';

const resolveLocation = async (input) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    input
  )}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en'
    }
  });

  const data = await res.json();

  if (!data.length) {
    throw new Error(`Unable to resolve location: ${input}`);
  }

  const { lat, lon, display_name } = data[0];

  return {
    lat,
    lon,
    name: display_name
  };
};

export default resolveLocation;
