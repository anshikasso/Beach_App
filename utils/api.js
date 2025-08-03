export const getWeatherData = async (lat, lon) => {
  const apiKey = '295ed020e70b43fda8b53955250108'; // Replace with your real API key
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};
