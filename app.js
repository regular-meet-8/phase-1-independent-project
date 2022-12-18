function formatDate() {
    let dateTime = document.querySelector("#dateTime");
    let currentDate = new Date();
  
    let day = currentDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
  
    let month = currentDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
  
    let year = currentDate.getFullYear();
  
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    dateTime.innerHTML = `${day}.${month}.${year}  ${hours}:${minutes}`;
  }
  
  formatDate();
  
  let apiKey = "93791ed1c5ac3002a2880b95c37460d5";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/`;
  let currentWeather = "weather?";
  let weatherForecast = "onecall?";
  
  function formatDayName(date) {
    let newDate = new Date(date * 1000);
    let realDay = newDate.getDay();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    return days[realDay];
  }
  
  function displayWeeklyForecast(response) {
    let forecastElement = document.querySelector("#weekForecast");
    let forecast = "";
    let days = response.data.daily;
    days.forEach(function (dayOfWeek, index) {
      if (index < 7) {
        forecast +=
          // the same as "forecast + "
          `
      <div class="row dayForecast">
              <div class="col-8">${formatDayName(dayOfWeek.dt)}</div>
              <div class="col-2">${Math.round(dayOfWeek.temp.max)}</div>
              <div class="col-2 nightTemperature">${Math.round(
                dayOfWeek.temp.min
              )}</div>
      </div>`;
      }
    });
    forecastElement.innerHTML = forecast;
  }
  
  function searchWeeklyForecast(coordinates) {
    let latitude = coordinates.lat;
    let longitude = coordinates.lon;
    let apiUrl = `${apiEndpoint}${weatherForecast}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl).then(displayWeeklyForecast);
  }
  
  function showWeather(response) {
    let temperatureElement = document.querySelector("h1");
    let descriptionElement = document.querySelector("#description");
    let cityElement = document.querySelector("#location");
    let iconElement = document.querySelector("#weatherIcon");
  
    let temperature = Math.round(response.data.main.temp);
    let description = response.data.weather[0].description;
    let city = response.data.name;
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
  
    temperatureElement.innerHTML = `${temperature}`;
    descriptionElement.innerHTML = `${description}`;
    cityElement.innerHTML = `${city}`;
  
    searchWeeklyForecast(response.data.coord);
  }
  
  function searchWeather(city) {
    let apiUrl = `${apiEndpoint}${currentWeather}q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showWeather);
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    let cityElement = document.querySelector("#searchCity").value;
    searchWeather(cityElement);
  }
  
  let searchForm = document.querySelector(".searchForm");
  searchForm.addEventListener("submit", handleSubmit);
  
  function findPosition(location) {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    let apiUrl = `${apiEndpoint}${currentWeather}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl).then(showWeather);
  }
  
  function getCoordinates() {
    navigator.geolocation.getCurrentPosition(findPosition);
  }
  
  let locationButton = document.querySelector("#locationButton");
  locationButton.addEventListener("click", getCoordinates);
  
  searchWeather("Chernihiv");