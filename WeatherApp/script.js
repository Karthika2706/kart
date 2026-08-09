// ---------- Config ----------
const DIAL_CIRCUMFERENCE = 628; // 2 * π * r(100), matches the SVG in index.html
const TEMP_MIN = -20; // °C, dial floor
const TEMP_MAX = 45;  // °C, dial ceiling

// ---------- State ----------
let apiKey = localStorage.getItem('atmos_api_key') || '';
let currentUnit = 'C';
let lastData = null; // always stored in Celsius; converted for display

// ---------- Elements ----------
const el = {
  keyGate: document.getElementById('key-gate'),
  keyForm: document.getElementById('key-form'),
  keyInput: document.getElementById('api-key-input'),
  loading: document.getElementById('loading-state'),
  error: document.getElementById('error-state'),
  errorText: document.getElementById('error-text'),
  readout: document.getElementById('readout'),
  searchForm: document.getElementById('search-form'),
  cityInput: document.getElementById('city-input'),
  locateBtn: document.getElementById('locate-btn'),
  dialFill: document.getElementById('dial-fill'),
  tempValue: document.getElementById('temp-value'),
  feelsLike: document.getElementById('feels-like'),
  unitC: document.getElementById('unit-c'),
  unitF: document.getElementById('unit-f'),
  locationName: document.getElementById('location-name'),
  condition: document.getElementById('condition'),
  tempHigh: document.getElementById('temp-high'),
  tempLow: document.getElementById('temp-low'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  forecastStrip: document.getElementById('forecast-strip'),
  lastUpdated: document.getElementById('last-updated'),
};

// ---------- Init ----------
function init() {
  if (apiKey) {
    el.keyGate.hidden = true;
    // Try last city, else geolocation
    const lastCity = localStorage.getItem('atmos_last_city');
    if (lastCity) {
      fetchByCity(lastCity);
    }
  }

  el.keyForm.addEventListener('submit', onKeySubmit);
  el.searchForm.addEventListener('submit', onSearchSubmit);
  el.locateBtn.addEventListener('click', onLocateClick);
  el.unitC.addEventListener('click', () => setUnit('C'));
  el.unitF.addEventListener('click', () => setUnit('F'));
}

function onKeySubmit(e) {
  e.preventDefault();
  const value = el.keyInput.value.trim();
  if (!value) return;
  apiKey = value;
  localStorage.setItem('atmos_api_key', apiKey);
  el.keyGate.hidden = true;
  onLocateClick();
}

function onSearchSubmit(e) {
  e.preventDefault();
  const city = el.cityInput.value.trim();
  if (!city) return;
  fetchByCity(city);
}

function onLocateClick() {
  if (!apiKey) { el.keyGate.hidden = false; return; }
  if (!navigator.geolocation) {
    fetchByCity('London');
    return;
  }
  showLoading();
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    () => fetchByCity('London')
  );
}

function setUnit(unit) {
  if (unit === currentUnit || !lastData) {
    currentUnit = unit;
    updateUnitButtons();
    return;
  }
  currentUnit = unit;
  updateUnitButtons();
  render(lastData);
}

function updateUnitButtons() {
  el.unitC.classList.toggle('active', currentUnit === 'C');
  el.unitF.classList.toggle('active', currentUnit === 'F');
}

// ---------- Fetching ----------
async function fetchByCity(city) {
  showLoading();
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );
    if (!weatherRes.ok) throw new Error(weatherRes.status === 401 ? 'auth' : 'notfound');
    const weather = await weatherRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&units=metric&appid=${apiKey}`
    );
    const forecast = forecastRes.ok ? await forecastRes.json() : null;

    localStorage.setItem('atmos_last_city', city);
    lastData = buildModel(weather, forecast);
    render(lastData);
  } catch (err) {
    showError(err.message === 'auth'
      ? 'Invalid API key. Double-check your key and try again.'
      : `Couldn't find "${city}". Check the spelling and try again.`);
  }
}

async function fetchByCoords(lat, lon) {
  showLoading();
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!weatherRes.ok) throw new Error(weatherRes.status === 401 ? 'auth' : 'other');
    const weather = await weatherRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const forecast = forecastRes.ok ? await forecastRes.json() : null;

    localStorage.setItem('atmos_last_city', weather.name);
    lastData = buildModel(weather, forecast);
    render(lastData);
  } catch (err) {
    showError(err.message === 'auth'
      ? 'Invalid API key. Double-check your key and try again.'
      : 'Station offline. Try searching for a city instead.');
  }
}

// ---------- Data shaping ----------
function buildModel(weather, forecast) {
  const daily = forecast ? aggregateDaily(forecast.list) : [];
  return {
    city: weather.name,
    country: weather.sys?.country || '',
    condition: weather.weather[0]?.description || '—',
    icon: iconFor(weather.weather[0]?.main),
    temp: weather.main.temp,
    feelsLike: weather.main.feels_like,
    high: weather.main.temp_max,
    low: weather.main.temp_min,
    humidity: weather.main.humidity,
    windKmh: weather.wind.speed * 3.6,
    pressure: weather.main.pressure,
    visibilityKm: weather.visibility / 1000,
    daily,
  };
}

function aggregateDaily(list) {
  const byDay = {};
  list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const key = date.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(entry);
  });

  return Object.entries(byDay).slice(0, 5).map(([key, entries]) => {
    // prefer the entry closest to midday for a representative icon/condition
    const midday = entries.reduce((best, e) => {
      const hour = new Date(e.dt * 1000).getUTCHours();
      const bestHour = new Date(best.dt * 1000).getUTCHours();
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best;
    });
    const temps = entries.map((e) => e.main.temp);
    return {
      date: new Date(key),
      high: Math.max(...temps),
      low: Math.min(...temps),
      icon: iconFor(midday.weather[0]?.main),
    };
  });
}

function iconFor(main) {
  const map = {
    Clear: '☀',
    Clouds: '☁',
    Rain: '🌧',
    Drizzle: '🌦',
    Thunderstorm: '⛈',
    Snow: '❄',
    Mist: '🌫',
    Fog: '🌫',
    Haze: '🌫',
  };
  return map[main] || '◐';
}

// ---------- Rendering ----------
function cToF(c) { return (c * 9) / 5 + 32; }
function formatTemp(c) {
  const v = currentUnit === 'C' ? c : cToF(c);
  return `${Math.round(v)}°`;
}

function render(data) {
  hideStates();
  el.readout.hidden = false;

  el.locationName.textContent = data.country ? `${data.city}, ${data.country}` : data.city;
  el.condition.textContent = data.condition;
  el.tempValue.textContent = formatTemp(data.temp).replace('°', '');
  el.feelsLike.textContent = `feels like ${formatTemp(data.feelsLike)}`;
  el.tempHigh.textContent = formatTemp(data.high);
  el.tempLow.textContent = formatTemp(data.low);

  el.humidity.textContent = `${data.humidity}%`;
  el.wind.textContent = `${Math.round(data.windKmh)} km/h`;
  el.pressure.textContent = `${data.pressure} hPa`;
  el.visibility.textContent = `${data.visibilityKm.toFixed(1)} km`;

  // Dial: map temp to fill amount + color
  const clamped = Math.min(Math.max(data.temp, TEMP_MIN), TEMP_MAX);
  const fraction = (clamped - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
  const offset = DIAL_CIRCUMFERENCE * (1 - fraction);
  el.dialFill.style.strokeDashoffset = offset;
  el.dialFill.style.stroke = data.temp <= 5 ? 'var(--teal-400)'
    : data.temp >= 28 ? 'var(--coral-400)'
    : 'var(--amber-500)';

  // Forecast strip
  el.forecastStrip.innerHTML = '';
  data.daily.forEach((day) => {
    const card = document.createElement('div');
    card.className = 'forecast-day';
    const dayName = day.date.toLocaleDateString(undefined, { weekday: 'short' });
    card.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-icon">${day.icon}</div>
      <div class="day-temp">${formatTemp(day.high)}</div>
      <div class="day-temp-low">${formatTemp(day.low)}</div>
    `;
    el.forecastStrip.appendChild(card);
  });

  el.lastUpdated.textContent = `updated ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
}

function showLoading() {
  hideStates();
  el.loading.hidden = false;
}

function showError(message) {
  hideStates();
  el.errorText.textContent = message;
  el.error.hidden = false;
}

function hideStates() {
  el.loading.hidden = true;
  el.error.hidden = true;
  el.readout.hidden = true;
}

// ---------- Ticks (drawn once, decorative — reinforces the instrument-dial signature) ----------
function drawTicks() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const g = document.getElementById('dial-ticks');
  const cx = 120, cy = 120, rInner = 88, rOuter = 96;
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * 2 * Math.PI;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'var(--navy-700)');
    line.setAttribute('stroke-width', i % 5 === 0 ? '2' : '1');
    g.appendChild(line);
  }
}

drawTicks();
init();
