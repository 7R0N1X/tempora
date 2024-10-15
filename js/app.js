document.addEventListener("DOMContentLoaded", function () {

  const ipInfoToken = import.meta.env.VITE_IP_INFO_TOKEN;
  const openWeatherKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

  const $date = document.querySelector("#date");
  const $temperature = document.querySelector("#temperature > span");
  const $city = document.querySelector("#city");
  const $min = document.querySelector("#min");
  const $max = document.querySelector("#max");
  const $humidity = document.querySelector("#humidity");

  const getDate = () => {
    const date = new Date();

    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const dayText = days[date.getDay()]
    const dayNumber = date.getDate();
    const monthText = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayText}, ${dayNumber} de ${monthText}, ${year}`;
  }

  const getLocation = async () => {
    const response = await fetch(`https://ipinfo.io/json?token=${ipInfoToken}`);
    const data = await response.json();
    return data
  };

  const kelvinToCelsius = (kelvin) => Math.floor(kelvin - 273.15);

  const getTemperature = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  getLocation().then(data => {
    const { loc } = data
    const [lat, lon] = loc.split(",");

    getTemperature(lat, lon).then(data => {
      const { main: { temp, temp_max, temp_min, humidity }, name } = data;
      const _temp = kelvinToCelsius(temp);
      const tempMax = kelvinToCelsius(temp_max);
      const tempMin = kelvinToCelsius(temp_min);
      const _humidity = humidity + "%";

      $temperature.innerText = _temp;
      $city.innerText = name;
      $min.innerText = `Min: ${tempMin}`;
      $max.innerText = `Max: ${tempMax}`;
      $humidity.innerText = `Hum: ${_humidity}`;
    })
  })

  $date.innerText = getDate();
})