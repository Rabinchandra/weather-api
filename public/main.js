const output = document.querySelector("#output");
const form = document.form;
const loaderUrl = "/assets/loader.gif";

function renderCitiesWeather({ weather }) {
  output.innerHTML = "";

  for (let key in weather) {
    const value = weather[key];
    if (value) {
      output.innerHTML += `<li>${key} <span>${value.slice(
        0,
        -1
      )} °C</span></li>`;
    } else {
      alert(`Location: ${key} not found`);
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cities = form.input.value.split(",");
  console.log(cities);

  output.innerHTML = `<img src=${loaderUrl} />`;

  fetch("/getWeather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cities: cities,
    }),
  })
    .then((res) => res.json())
    .then((data) => renderCitiesWeather(data))
    .catch((err) => console.log(err));
});
