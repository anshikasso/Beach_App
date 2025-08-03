import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { getWeatherData } from '../utils/api';
import { getScore, riskStatus } from '../utils/safetyUtils';
import { styles } from '../utils/styles';

const coastalStatesCoordinates = {
  "Andhra Pradesh": { lat: 15.9129, lon: 79.7400 },
  "Goa": { lat: 15.2993, lon: 74.1240 },
  "Gujarat": { lat: 22.2587, lon: 71.1924 },
  "Kerala": { lat: 10.8505, lon: 76.2711 },
  "Maharashtra": { lat: 19.7515, lon: 75.7139 },
  "Odisha": { lat: 20.9517, lon: 85.0985 },
  "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
  "West Bengal": { lat: 22.9868, lon: 87.8550 },
  "Karnataka": { lat: 15.3173, lon: 75.7139 }
};

export default function WeatherSafety() {
  const [stateName, setStateName] = useState('');
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setStatus('');
    setWeather(null);

    const stateCoords = coastalStatesCoordinates[stateName.trim()];
    if (!stateCoords) {
      setStatus('Invalid or unsupported state name. Please enter a valid coastal state.');
      return;
    }

    setLoading(true);
    try {
      const data = await getWeatherData(stateCoords.lat, stateCoords.lon);

      const temp = data.main.temp;
      const rain = data.rain ? data.rain['1h'] || 0 : 0;
      const wind = data.wind.speed;
      const visibility = data.visibility;
      const heat = data.main.feels_like;
      const tide = 'moderate'; // For MVP, can improve later

      const score = getScore(temp, rain, wind, visibility, heat, tide);
      const risk = riskStatus(score);

      setWeather({ temp, rain, wind, visibility, heat, tide, score, risk });
      setStatus(`Status: ${risk.text} ${risk.emoji}`);
    } catch (err) {
      setStatus('Failed to get weather: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beach Safety Forecast</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Coastal State Name"
        value={stateName}
        onChangeText={setStateName}
        autoCapitalize="words"
      />

      <Pressable style={styles.button} onPress={handleFetch}>
        <Text style={styles.buttonText}>Get Weather & Safety</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {weather && (
        <View style={styles.weatherInfo}>
          <Text>Temperature: {weather.temp}°C</Text>
          <Text>Rain (last 1h): {weather.rain} mm</Text>
          <Text>Wind: {(weather.wind * 3.6).toFixed(1)} km/h</Text>
          <Text>Visibility: {(weather.visibility / 1000).toFixed(1)} km</Text>
          <Text>Heat Index: {weather.heat}°C</Text>
          <Text>Tide: {weather.tide}</Text>
          <Text>{status}</Text>
        </View>
      )}

      {!weather && status ? <Text>{status}</Text> : null}
    </View>
  );
}
