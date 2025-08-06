// Author: Rudrasena Reddy
// Gmail: b.rudrasenareddy@gmail.com

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    const currentWeatherItemsEl = document.getElementById("current-weather-items");
    const timezoneEl = document.getElementById("time-zone");
    const countryEl = document.getElementById("country");
    const weatherForecastEl = document.getElementById("weather-forecast");
    const currentTempEl = document.getElementById("current-temp");
    const searchBtn = document.getElementById("search-btn");
    const locationInput = document.getElementById("location-input");

    // Air Quality Elements
    const aqiGaugeEl = document.getElementById("aqi-gauge");
    const aqiValueEl = document.getElementById("aqi-value");
    const aqiInfoEl = document.getElementById("air-quality-info");

    // Lottie Player
    const weatherAnimationPlayer = document.getElementById("weather-animation");

    // Animation Delays
    let animationDelay = 0;

    // Lottie mapping to weather condition codes
    const weatherLottieMap = {
        1000: 'https://assets1.lottiefiles.com/packages/lf20_q0x5v04e.json', // Sunny
        1003: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Partly cloudy
        1006: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Cloudy
        1009: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Overcast
        1063: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Patchy rain
        1150: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Light drizzle
        1180: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Patchy light rain
        1183: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Light rain
        1186: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Moderate rain
        1195: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Heavy rain
        1087: 'https://assets1.lottiefiles.com/packages/lf20_xX5v5h.json', // Thundery
        1273: 'https://assets1.lottiefiles.com/packages/lf20_xX5v5h.json', // Patchy light rain with thunder
        1210: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Light snow
        1225: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Heavy snow
        1135: 'https://assets9.lottiefiles.com/packages/lf20_6s0N6J.json'  // Fog
    };

    // Clock function
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;

        timeEl.innerHTML = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} <span id="am-pm">${ampm}</span>`;
        dateEl.innerHTML = moment(now).format('dddd, D MMM');
    }

    // Fetch weather data with proper error handling
    async function fetchWeatherData(location) {
        try {
            const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Special handling for Delhi to ensure India location
            if (location.toLowerCase().includes('delhi') && data.location?.country !== 'India') {
                console.log('Falling back to Delhi,IN');
                return await fetchWeatherData('Delhi,IN');
            }
            
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Set weather animation based on condition code
    function setWeatherAnimation(code) {
        if (!weatherAnimationPlayer) return;
        const lottieUrl = weatherLottieMap[code] || weatherLottieMap[1000];
        weatherAnimationPlayer.load(lottieUrl);
    }

    // Display air quality data with robust error handling
    function displayAirQuality(aqiData) {
        // Default values when no data
        if (!aqiData) {
            console.log('No AQI data provided');
            aqiValueEl.textContent = '--';
            aqiInfoEl.textContent = 'No data available';
            return;
        }

        // WeatherAPI.com provides AQI in this format:
        // air_quality: {
        //   co: 253.7,
        //   no2: 4.3,
        //   o3: 100.3,
        //   so2: 2.3,
        //   pm2_5: 15.7,
        //   pm10: 17.7,
        //   "us-epa-index": 1,
        //   "gb-defra-index": 2
        // }

        const aqiValue = aqiData['us-epa-index'] || 0;
        console.log('AQI Value from API:', aqiValue);

        // AQI level information (EPA standard)
        const aqiLevels = [
            { text: 'Good', color: '#00e400', min: 1, max: 1 },
            { text: 'Moderate', color: '#ffff00', min: 2, max: 2 },
            { text: 'Unhealthy for Sensitive', color: '#ff7e00', min: 3, max: 3 },
            { text: 'Unhealthy', color: '#ff0000', min: 4, max: 4 },
            { text: 'Very Unhealthy', color: '#8f3f97', min: 5, max: 5 },
            { text: 'Hazardous', color: '#7e0023', min: 6, max: 6 }
        ];

        // Determine AQI level
        let levelInfo = { text: 'No data', color: '#cccccc' };
        if (aqiValue >= 1 && aqiValue <= 6) {
            levelInfo = aqiLevels[aqiValue - 1];
        }

        // Update display
        aqiValueEl.textContent = aqiValue > 0 ? aqiValue : '--';
        aqiInfoEl.innerHTML = `<div style="color: ${levelInfo.color}">${levelInfo.text}</div>`;

        // Update gauge visualization
        if (aqiGaugeEl) {
            // Calculate percentage (1-6 scale mapped to 0-180 degrees)
            const percentage = ((aqiValue / 6) * 100) || 0;
            aqiGaugeEl.style.background = `conic-gradient(
                #00e400 0% 16.6%, 
                #ffff00 16.6% 33.3%, 
                #ff7e00 33.3% 50%, 
                #ff0000 50% 66.6%, 
                #8f3f97 66.6% 83.3%, 
                #7e0023 83.3% ${percentage}%,
                transparent ${percentage}% 100%
            )`;
        }
    }

    // Display all weather data
    function displayWeatherData(data) {
        if (!data) {
            console.error('No data received');
            return;
        }

        console.log('API Response:', data); // Debug log

        const { location, current, forecast } = data;

        // Update location
        if (timezoneEl) timezoneEl.textContent = location?.name || '--';
        if (countryEl) countryEl.textContent = location?.country || '--';

        // Update current weather
        if (currentWeatherItemsEl && current) {
            currentWeatherItemsEl.innerHTML = `
                <div class="weather-item">
                    <div>Condition</div>
                    <div>${current.condition?.text || '--'}</div>
                </div>
                <div class="weather-item">
                    <div>Temperature</div>
                    <div>${current.temp_c || '--'}°C</div>
                </div>
                <div class="weather-item">
                    <div>Feels Like</div>
                    <div>${current.feelslike_c || '--'}°C</div>
                </div>
                <div class="weather-item">
                    <div>Humidity</div>
                    <div>${current.humidity || '--'}%</div>
                </div>
                <div class="weather-item">
                    <div>Wind</div>
                    <div>${current.wind_kph || '--'} km/h</div>
                </div>
                <div class="weather-item">
                    <div>UV Index</div>
                    <div>${current.uv || '--'}</div>
                </div>
            `;
        }

        // Update today's weather
        const today = forecast?.forecastday?.[0];
        if (today && current) {
            const todayElement = document.querySelector('.today .other');
            if (todayElement) {
                todayElement.innerHTML = `
                    <div class="day">Today</div>
                    <div class="temp">Current: ${current.temp_c || '--'}°C</div>
                    <div class="temp">High: ${today.day?.maxtemp_c || '--'}°C</div>
                    <div class="temp">Low: ${today.day?.mintemp_c || '--'}°C</div>
                `;
            }
            setWeatherAnimation(current.condition?.code);
        }

        // Update forecast
        if (weatherForecastEl) {
            weatherForecastEl.innerHTML = '';
            
            if (forecast?.forecastday) {
                forecast.forecastday.slice(1, 6).forEach((day, index) => {
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'weather-forecast-item';
                    forecastItem.style.setProperty('--order', index);
                    forecastItem.innerHTML = `
                        <div class="day">${moment(day.date).format('ddd')}</div>
                        <img src="${day.day?.condition?.icon || ''}" 
                             alt="${day.day?.condition?.text || 'Weather icon'}" class="w-icon">
                        <div class="temp">High: ${day.day?.maxtemp_c || '--'}°C</div>
                        <div class="temp">Low: ${day.day?.mintemp_c || '--'}°C</div>
                    `;
                    weatherForecastEl.appendChild(forecastItem);
                });
            }
        }
        
        // Update air quality - WeatherAPI.com provides this in current.air_quality
        displayAirQuality(current?.air_quality);
    }

    // Search handler
    async function handleSearch() {
        const location = locationInput.value.trim();
        if (!location) return;

        try {
            searchBtn.disabled = true;
            searchBtn.innerHTML = `Searching...`;
            
            const weatherData = await fetchWeatherData(location);
            displayWeatherData(weatherData);
        } catch (error) {
            console.error('Search error:', error);
            aqiValueEl.textContent = '--';
            aqiInfoEl.textContent = 'Error loading data';
        } finally {
            searchBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>`;
            searchBtn.disabled = false;
        }
    }

    // Event listeners
    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', handleSearch);
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Initialize
    updateClock();
    setInterval(updateClock, 1000);
    fetchWeatherData('London')
        .then(displayWeatherData)
        .catch(error => console.error('Initial load error:', error));
});