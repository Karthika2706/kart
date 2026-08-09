# ATMOS — Weather Station

A small weather app styled like an instrument-panel readout: a circular temperature dial, tick marks, and a 5-day forecast strip. Pure HTML/CSS/JS — no build step, no framework.

![preview](https://via.placeholder.com/800x400?text=ATMOS+Weather+Station)
*(replace this with a real screenshot once it's running)*

## Features
- Search weather by city name
- "Use my location" via browser geolocation
- Circular dial visualizing current temperature, color-coded (cool/mild/hot)
- °C / °F toggle
- 5-day forecast
- Humidity, wind, pressure, visibility readouts
- Remembers your last city and API key (stored only in your browser)

## Setup

1. Get a free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Open `index.html` in a browser (or serve the folder — see below).
3. Paste your API key when prompted. It's saved to `localStorage` so you only enter it once.

> Note: new OpenWeatherMap keys can take up to a couple of hours to activate.

### Run locally
No build tools needed. Either:
- Open `index.html` directly in your browser, or
- Serve it locally to avoid any local-file quirks:
  ```bash
  npx serve .
  # or
  python3 -m http.server 8000
  ```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Pick your branch (e.g. `main`) and `/ (root)` as the folder, then **Save**.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## File structure
```
weather-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Notes
- All API calls happen client-side, which is why the app needs your own API key rather than shipping with one baked in — keeping a key private isn't possible in a static, publicly-hosted repo.
- Everything (key, last-searched city) is stored only in your own browser's `localStorage` — nothing is sent anywhere except to OpenWeatherMap.

## Possible next steps
- Hourly forecast chart (Chart.js)
- Weather-based background themes
- PWA support for offline use
