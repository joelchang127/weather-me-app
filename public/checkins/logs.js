// the [_, _] are the latitude and longitude, and the 1 is the zoom level for the map when it first loads
const mymap = L.map('checkinMap').setView([0, 0], 2); 
const attribution = // need to use an attribution due to copyright issues
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// tiles are the images that make up the map
  const tileUrl =
  // just the url for a tile in general. telling leaflet to just make it using this convention
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'; 
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  console.log(data);

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here at ${item.city} (${item.lat}&deg; 
    ${item.lon}&deg;) has ${item.description} with
    a temperature of ${item.temp}&deg; C.`;

    if (item.aqi_val < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  The AQI, or the concentration of particulate matter 
    PM2.50, is ${item.aqi_val} µg/m3, last read on ${item.aqi_ts}`;
    }
    marker.bindPopup(txt);
  }
}