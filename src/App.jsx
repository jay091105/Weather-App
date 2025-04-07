import React, { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      setWeather(null);

      // 1. Get coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Get weather for those coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        throw new Error('Weather data not available.');
      }

      setWeather({
        city: name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f7ff, #b3e0ff, #66c2ff)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '400px',
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <h2 style={{ 
          marginBottom: '30px', 
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>🌤 Weather Forecast</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#0083b0',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease',
            }}
          >
            Search
          </button>
        </form>

        {loading && (
          <div style={{ margin: '20px 0' }}>
            <p style={{ color: '#666' }}>Loading weather data...</p>
          </div>
        )}
        {error && (
          <p style={{ 
            color: '#e74c3c',
            padding: '12px',
            backgroundColor: '#fde8e8',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            {error}
          </p>
        )}

        {weather && !loading && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ 
              marginBottom: '15px',
              color: '#333',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {weather.city}, {weather.country}
            </h3>
            <p style={{ 
              fontSize: '36px',
              fontWeight: '700',
              color: '#0083b0',
              margin: '10px 0'
            }}>
              {weather.temperature}°C
            </p>
            <p style={{ 
              color: '#666',
              fontSize: '16px',
              marginTop: '10px'
            }}>
              Wind Speed: {weather.windspeed} km/h
            </p>
          </div>
        )}

        {!weather && !error && !loading && (
          <p style={{ 
            color: '#666',
            fontSize: '16px',
            marginTop: '20px'
          }}>
            Enter a city name to see the weather forecast
          </p>
        )}
      </div>
    </div>
  );
}
