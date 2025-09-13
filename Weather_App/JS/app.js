const apiKey = "5d361e952180c8b960aa9c3964d59dc8";

// Wait for the DOM to load before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Function triggered by the button
    function getWeather() {
        const city = document.getElementById('city').value.trim();
        if (!city) {
            alert("Please enter a city name");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        fetchWeatherData(url);
    }

    // Fetch and display weather data
    function fetchWeatherData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const current = data.list[0];

                // Displaying current weather
                document.getElementById("temp-value").textContent = `${current.main.temp}°C`;
                document.getElementById("humidity-value").textContent = `${current.main.humidity}%`;
                document.getElementById("desc-value").textContent = current.weather[0].description;

                // Displaying current weather icon
                const iconCode = current.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                // Ensure the current-icon exists before trying to set its src
                const currentIcon = document.getElementById("current-icon");
                if (currentIcon) {
                    currentIcon.src = iconUrl;
                } else {
                    console.error("Current weather icon element not found");
                }

                // Forecast (3-Day)
                const forecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 3);

                forecast.forEach((item, i) => {
                    const date = new Date(item.dt_txt).toDateString();
                    document.getElementById(`day${i + 1}-name`).textContent = date;
                    document.getElementById(`day${i + 1}-temp`).textContent = `${item.main.temp}°C`;
                    document.getElementById(`day${i + 1}-humidity`).textContent = `${item.main.humidity}%`;
                    document.getElementById(`day${i + 1}-desc`).textContent = item.weather[0].description;

                    // Adding icon to the forecast days
                    const forecastIcon = item.weather[0].icon;
                    const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;

                    // Ensure forecast icon exists before setting
                    const forecastIconElement = document.getElementById(`day${i + 1}-icon`);
                    if (forecastIconElement) {
                        forecastIconElement.src = forecastIconUrl;
                    } else {
                        console.error(`Forecast day ${i + 1} icon element not found`);
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                alert("Failed to fetch weather data");
            });
    }

    // Event listener for search button
    document.querySelector("button").addEventListener("click", getWeather);
});


