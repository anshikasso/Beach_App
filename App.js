import React from 'react';
import { View } from 'react-native';
import WeatherSafety from './components/WeatherSafety';
import { styles } from './utils/styles';

export default function App() {
  return (
    <View style={styles.container}>
      <WeatherSafety />
    </View>
  );
}
