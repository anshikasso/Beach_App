// Score value: Safe=0, Caution=1, Unsafe=2
export function getScore(temp, rain, wind, visibility, heatIndex, tideLevel){
  let score = 0;
  // Temperature
  if (temp < 24 || temp > 36) score += 2;
  else if (temp >= 33 && temp <= 36) score += 1;

  // Rain (units: mm/h, check your API)
  if (rain >= 7.5) score += 2; // e.g., >7.5mm/h as heavy
  else if (rain > 2.5) score += 1;

  // Wind (km/h; check API returns m/s, convert: 1 m/s = 3.6 km/h)
  if (wind > 40/3.6) score += 2;
  else if (wind >= 20/3.6) score += 1;

  // Visibility (meters; >6km=6000)
  if (visibility < 3000) score += 2;
  else if (visibility >= 3000 && visibility <= 6000) score += 1;

  // Heat Index (C)
  if (heatIndex > 40) score += 2;
  else if (heatIndex >= 35) score += 1;

  // Tide Level can be hardcoded/mock or fetched from additional data source nt avaiabe in free api 
  if (tideLevel === 'extreme') score += 2;
  else if (tideLevel === 'high') score += 1;

  return score;
}

export function riskStatus(score) {
  if (score <= 3) return {text: "Good", emoji: "🟢"};
  if (score <= 7) return {text: "Caution", emoji: "🟡"};
  return {text: "Unsafe", emoji: "🔴"};
}
