const api_key = "c4752763fab771f783293346ca61de40";

// Get the latitude and longitude of a particular city
async function getLatLong(city) {
  const result = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`
  );
  const data = await result.json();
  return { lat: data[0]?.lat, lon: data[0]?.lon };
}

// Function to return array of objects having - city and it's coordinates
async function getCitiesCoordinates(cities) {
  let coordinates = cities.map(async (city) => {
    const pos = await getLatLong(city);
    return { city, lat: pos.lat, lon: pos.lon };
  });

  return await Promise.all(coordinates);
}

// Get weather of all cities
async function getCitiesWeather(cities) {
  try {
    const result = { weather: {} };
    // fetch the weather in kelvin of each city
    const promise = await cities.map(async (city) => {
      // if city doesn not have latitude and longitude, then the city doesn't exist
      if (!city.lat || !city.lon) {
        result.weather[city.city] = null;
        return;
      }
      // if city exists, then fetch the data
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${api_key}`
      );
      const data = await res.json();
      const temp = data.hourly[0].temp;
      // Note: temperature is in kelvin, so we need to convert to celsius
      // C = K - 273.15
      result.weather[city.city] = (temp - 273.15).toFixed(3) + "C";
    });

    const data = await Promise.all(promise);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCitiesCoordinates,
  getCitiesWeather,
};
