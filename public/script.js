// Author : Rudrasena Reddy
// Gmail : b.rudrasenareddy@gmail.com

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

// Lottie mapping to weather condition codes (WeatherAPI codes)
const weatherLottieMap = {
    // Sunny/Clear
    1000: 'https://assets1.lottiefiles.com/packages/lf20_q0x5v04e.json', // Sun
    // Cloudy
    1003: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Partly cloudy
    1006: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Cloudy
    1009: 'https://assets5.lottiefiles.com/packages/lf20_e8yhtj9p.json', // Overcast
    // Rain
    1063: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Patchy rain
    1150: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Light drizzle
    1153: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Light drizzle
    1180: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Patchy light rain
    1183: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Light rain
    1186: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Moderate rain at times
    1189: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Moderate rain
    1192: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Heavy rain at times
    1195: 'https://assets9.lottiefiles.com/packages/lf20_oWz6rQ.json', // Heavy rain
    // Thunder
    1087: 'https://assets1.lottiefiles.com/packages/lf20_xX5v5h.json', // Thundery outbreaks
    1273: 'https://assets1.lottiefiles.com/packages/lf20_xX5v5h.json', // Patchy light rain with thunder
    1276: 'https://assets1.lottiefiles.com/packages/lf20_xX5v5h.json', // Moderate or heavy rain with thunder
    // Snow
    1210: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Light snow
    1213: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Light snow
    1216: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Patchy moderate snow
    1219: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Moderate snow
    1222: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Patchy heavy snow
    1225: 'https://assets2.lottiefiles.com/packages/lf20_j5W16h.json', // Heavy snow
    // Fog
    1135: 'https://assets9.lottiefiles.com/packages/lf20_6s0N6J.json', // Fog
    1147: 'https://assets9.lottiefiles.com/packages/lf20_6s0N6J.json', // Freezing fog
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

updateClock();
setInterval(updateClock, 1000);

async function fetchWeatherData(location) {
    try {
        // In a real app, replace this with your actual API endpoint
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Function to set the Lottie animation based on weather condition code
function setWeatherAnimation(code) {
    if (!weatherAnimationPlayer) return;
    
    const lottieUrl = weatherLottieMap[code] || 'https://assets1.lottiefiles.com/packages/lf20_q0x5v04e.json';
    weatherAnimationPlayer.load(lottieUrl);
}

// Function to display air quality data
function displayAirQuality(aqiData) {
    if (!aqiData) return;
    
    const aqi = aqiData['us-epa-index'] || 0;
    let aqiText = '';
    let aqiColor = '';

    if (aqi === 1) {
        aqiText = 'Good';
        aqiColor = '#00e400';
    } else if (aqi === 2) {
        aqiText = 'Moderate';
        aqiColor = '#ffff00';
    } else if (aqi === 3) {
        aqiText = 'Unhealthy for Sensitive Groups';
        aqiColor = '#ff7e00';
    } else if (aqi === 4) {
        aqiText = 'Unhealthy';
        aqiColor = '#ff0000';
    } else if (aqi === 5) {
        aqiText = 'Very Unhealthy';
        aqiColor = '#8f3f97';
    } else if (aqi === 6) {
        aqiText = 'Hazardous';
        aqiColor = '#7e0023';
    } else {
        aqiText = 'No data';
        aqiColor = '#cccccc';
    }

    if (aqiValueEl) aqiValueEl.textContent = aqi || '--';
    if (aqiInfoEl) aqiInfoEl.innerHTML = `<div class="aqi-level" style="color: ${aqiColor}">${aqiText}</div>`;

    // Visual gauge
    if (aqiGaugeEl) {
        const gaugeValue = (aqi - 1) * 20;
        aqiGaugeEl.style.setProperty('--gauge-rotation', `${gaugeValue}deg`);
    }
}

function displayWeatherData(data) {
    if (!data) return;
    
    const { location, current, forecast } = data;

    // Update location info
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

    // Update 5-day forecast
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
    
    // Display Air Quality Index
    if (current?.air_quality) {
        displayAirQuality(current.air_quality);
    }

    // Add hover effects
    addHoverEffects();
}

function addHoverEffects() {
    // Today's card hover effect
    const todayCard = document.querySelector('.today');
    if (todayCard) {
        todayCard.addEventListener('mouseenter', () => {
            todayCard.style.transform = 'translateY(-5px)';
        });
        todayCard.addEventListener('mouseleave', () => {
            todayCard.style.transform = 'translateY(0)';
        });
    }

    // Forecast items hover effects
    const forecastItems = document.querySelectorAll('.weather-forecast-item');
    forecastItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
}

// Event Listeners
if (searchBtn && locationInput) {
    searchBtn.addEventListener('click', async () => {
        const location = locationInput.value.trim();
        if (!location) return;

        try {
          
            searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
            searchBtn.disabled = true;
            
            const weatherData = await fetchWeatherData(location);
            displayWeatherData(weatherData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
            searchBtn.disabled = false;
        }
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('London')
        .then(displayWeatherData)
        .catch(error => console.error('Initial load error:', error));
});

if (weatherForecastEl) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const forecastItems = document.querySelectorAll('.weather-forecast-item');
                forecastItems.forEach((item, index) => {
                    item.style.setProperty('--order', index);
                });
            }
        });
    });

    observer.observe(weatherForecastEl, { childList: true });
}