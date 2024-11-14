const cityInput = document.getElementById('city-input');
const unitToggle = document.getElementById('unit-toggle');
const currentWeatherItems = document.getElementById('current-weather-items');
const currentTemp = document.getElementById('current-temp');
const weatherForecast = document.getElementById('weather-forecast');
const timeZone = document.getElementById('time-zone');
const country = document.getElementById('country');
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');

let unit = 'metric'; // Default to Celsius

// Update time and date
function updateTimeAndDate() {
    const now = new Date();
    timeDisplay.textContent = moment(now).format('h:mm');
    document.getElementById('am-pm').textContent = moment(now).format('A');
    dateDisplay.textContent = moment(now).format('dddd, D MMM');
}

// Fetch and display weather data by city name
async function searchCity() {
    const city = cityInput.value.trim();
    if (!city) return;

    const api_key = "274948df88caa0be0f7deed9d0b11214";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${api_key}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${api_key}`;

    try {
        const [weatherData, forecastData] = await Promise.all([
            fetch(url).then(response => response.json()),
            fetch(forecastUrl).then(response => response.json())
        ]);

        if (weatherData.cod === "404") {
            alert("City not found");
            return;
        }

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        updateTimeAndDate();
        
        timeZone.textContent = weatherData.timezone;
        country.textContent = weatherData.sys.country;

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temperature = `${Math.round(data.main.temp)}°${unit === 'metric' ? 'C' : 'F'}`;
    const description = data.weather[0].description;
    const humidity = `${data.main.humidity}%`;
    const windSpeed = `${(data.wind.speed * (unit === 'metric' ? 3.6 : 2.237)).toFixed(2)} ${unit === 'metric' ? 'Km/H' : 'MPH'}`;

    currentTemp.innerHTML = `
        <div class="temp">${temperature}</div>
        <div class="description">${description}</div>
    `;
    
    currentWeatherItems.innerHTML = `
        <div class="weather-item">
            <span>Humidity</span>
            <span>${humidity}</span>
        </div>
        <div class="weather-item">
            <span>Wind Speed</span>
            <span>${windSpeed}</span>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    weatherForecast.innerHTML = ''; // Clear previous forecast

    const forecastDays = data.list.filter((_, index) => index % 8 === 0); // Get one forecast per day

    forecastDays.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.className = 'weather-forecast-item';
        dayElem.innerHTML = `
            <div class="day">${moment(day.dt * 1000).format('ddd')}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
            <div class="temp">High: ${Math.round(day.main.temp_max)}°</div>
            <div class="temp">Low: ${Math.round(day.main.temp_min)}°</div>
        `;
        weatherForecast.appendChild(dayElem);
    });
}

// Toggle unit and refresh weather data
function toggleUnit() {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    const city = cityInput.value.trim();
    if (city) searchCity(); // Refresh data with the new unit
}

// Update date and time every minute
setInterval(updateTimeAndDate, 60000);

// Initial load of time and date
updateTimeAndDate();
