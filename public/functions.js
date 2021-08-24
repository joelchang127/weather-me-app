if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try {
      lat = position.coords.latitude.toFixed(4);
      lon = position.coords.longitude.toFixed(4);
      const api_url = `/weather/${lat}/${lon}`
      const response = await fetch(api_url);
      const json = await response.json();
      console.log(json);
      console.log(json.weather)
      console.log(json.air_quality);

      weather = json.weather;
      air = json.air_quality.data.current.pollution;
      document.getElementById("description").textContent = weather.weather[0].description;
      document.getElementById("temp").textContent = weather.main.feels_like;
      document.getElementById("city").textContent = weather.name;

      document.getElementById("aqi-val").textContent = air.aqius;
      document.getElementById("aqi-timestamp").textContent = air.ts;

      console.log(document.querySelector(".hidden"));
      document.querySelector(".hidden").className = "show";
      console.log(document.querySelector(".hidden"));
    } catch(error) {
      console.log("something went wrong");
    }
  })
  } else {
    air = { value: -1 }
    console.log("geolocation not available")
  }
  async function sendToServer() {
    navigator.geolocation.getCurrentPosition(async position => {
      console.log("sendToServer called")
      var lat = position.coords.latitude.toFixed(4);
      var lon = position.coords.longitude.toFixed(4);
      const aqi_val = document.getElementById("aqi-val").textContent;
      const aqi_ts = document.getElementById("aqi-timestamp").textContent;
      const temp = document.getElementById("temp").textContent;
      const city = document.getElementById("city").textContent;
      const description = document.getElementById("description").textContent;
      const data = {lat, lon, city, temp, aqi_val, aqi_ts, description};
      const options = {
          method: "POST",
          headers: {
              "Content-Type": 'application/json'
          },
          body: JSON.stringify(data)
      }
      const response = await fetch("/api", options)
      const json = await response.json();
      console.log(json);
    })
  }
