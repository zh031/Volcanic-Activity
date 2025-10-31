// ----- FETCH GUATEMALA VOLCANO-RELATED EARTHQUAKE DATA -----
async function fetchGuatemalaVolcanoData() {
  const baseUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
  const params = {
    latitude: 14.6349,
    longitude: -90.5069,
    maxradius: 2, // approx 200km
    starttime: "2024-01-01",
    endtime: new Date().toISOString().split("T")[0],
    minmagnitude: 1.5
  };

  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&");
  const apiUrl = `${baseUrl}&${queryString}`;

  const earthquakeContainer = document.getElementById('earthquakeContainer');

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
    const data = await response.json();

    const volcanoes = [
      { name: "Pacaya", lat: 14.381, lon: -90.601 },
      { name: "Fuego", lat: 14.474, lon: -90.881 },
      { name: "Santiaguito", lat: 14.748, lon: -91.556 },
      { name: "Santa Maria", lat: 14.756, lon: -91.552 },
      { name: "Atitlán", lat: 14.634, lon: -91.183 },
      { name: "Acatenango", lat: 14.501, lon: -90.876 },
      { name: "Agua", lat: 14.462, lon: -90.743 },
      { name: "Tajumulco", lat: 15.044, lon: -91.903 },
      { name: "Tacaná", lat: 15.133, lon: -92.107 },
      { name: "Tolimán", lat: 14.606, lon: -91.188 },
      { name: "San Pedro", lat: 14.692, lon: -91.274 },
      { name: "Almolonga", lat: 14.780, lon: -91.492 },
      { name: "Zunil", lat: 14.786, lon: -91.504 },
      { name: "Cerro Quemado", lat: 14.810, lon: -91.543 }
      // Add more if needed
    ];

    const volcanoEvents = data.features.filter(event => {
      const [longitude, latitude] = event.geometry.coordinates;
      return volcanoes.some(v => Math.sqrt(Math.pow(latitude - v.lat, 2) + Math.pow(longitude - v.lon, 2)) < 0.2);
    });

    if (!volcanoEvents.length) {
      earthquakeContainer.innerHTML = "<p>No significant earthquakes recorded near Guatemala recently.</p>";
      return;
    }

    // Render earthquakes as styled cards
    earthquakeContainer.innerHTML = volcanoEvents.map(event => {
      const mag = event.properties.mag;
      const severity = mag < 4 ? "eq-low" : mag < 6 ? "eq-medium" : "eq-high";
      const magPercent = Math.min(mag * 20, 100);

      return `
        <div class="data-card">
          <h4>Magnitude: <span class="${severity}">${mag}</span></h4>
          <p>Location: ${event.properties.place}</p>
          <p>Time: ${new Date(event.properties.time).toLocaleString()}</p>
          <div class="bar-container">
            <div class="bar-fill ${severity}" style="width:${magPercent}%;"></div>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error fetching or processing data:", error);
    earthquakeContainer.innerHTML = "<p>Error loading earthquake data.</p>";
  }
}

// Call function after page load
document.addEventListener("DOMContentLoaded", fetchGuatemalaVolcanoData);
