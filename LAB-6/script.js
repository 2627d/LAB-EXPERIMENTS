// script.js (type=module)
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY_HERE'; // <-- REPLACE with your key
const STORAGE_KEY = 'weather_last_city';
const apiBase = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const weatherCard = document.getElementById('weatherCard');

const cityNameEl = document.getElementById('cityName');
const countryEl = document.getElementById('country');
const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const feelsLikeEl = document.getElementById('feels_like');

const refreshBtn = document.getElementById('refreshBtn');
const clearBtn = document.getElementById('clearBtn');

// Helper: show status text
const setStatus = (text, isError = false) => {
  statusEl.textContent = text;
  statusEl.style.color = isError ? 'crimson' : '';
};

// Helper: show/hide card
const showCard = (show = true) => {
  weatherCard.classList.toggle('hidden', !show);
};

// Build URL
const buildUrl = (city) => {
  const params = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: 'metric',
  });
  return `${apiBase}?${params.toString()}`;
};

// Render weather data to DOM
const renderWeather = (data) => {
  cityNameEl.textContent = `${data.name}`;
  countryEl.textContent = data.sys?.country ?? '';
  const iconCode = data.weather?.[0]?.icon;
  if (iconCode) {
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = data.weather[0].description || 'weather icon';
  } else {
    iconEl.src = '';
    iconEl.alt = '';
  }
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descEl.textContent = (data.weather?.[0]?.description ?? '').replace(/\b\w/g, c => c.toUpperCase());
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = (data.wind?.speed ?? 0).toFixed(1);
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  showCard(true);
};

// Fetch weather with async/await and error handling
const fetchWeather = async (city) => {
  if (!city || !city.trim()) {
    setStatus('Please enter a city name.', true);
    return;
  }

  setStatus('Fetching weather…');
  showCard(false);

  try {
    const url = buildUrl(city.trim());
    const resp = await fetch(url);

    if (!resp.ok) {
      if (resp.status === 404) throw new Error('City not found. Check spelling.');
      throw new Error(`API error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    // Minimal validation
    if (!data?.main || !data?.weather) throw new Error('Unexpected API response');

    // render and save
    renderWeather(data);
    setStatus(`Last updated: ${new Date().toLocaleTimeString()}`);
    localStorage.setItem(STORAGE_KEY, city.trim());
  } catch (err) {
    setStatus(err.message, true);
  }
};

// Restore last city on load
const restoreLastCity = () => {
  const last = localStorage.getItem(STORAGE_KEY);
  if (last) {
    cityInput.value = last;
    fetchWeather(last);
  }
};

// Event: form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  fetchWeather(city);
});

// Refresh button uses last saved city or input
refreshBtn.addEventListener('click', () => {
  const last = localStorage.getItem(STORAGE_KEY) || cityInput.value;
  if (last) fetchWeather(last);
});

// Clear stored city
clearBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  setStatus('Cleared last searched city.');
  cityInput.value = '';
  showCard(false);
});

// Optional: Enter key triggers submit automatically due to form
// Initialize
restoreLastCity();
