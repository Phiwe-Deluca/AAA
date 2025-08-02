export async function getWeatherByCoords(lat: number, lon: number) {
  const API_KEY = "3be5c8cd8ccb0a17c108f5b9996bcc39";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    return {
      location: { lat, lon },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      },
    };
  } catch (err: any) {
    console.error("Error fetching weather data:", err);
    return { error: err.message };
  }
}