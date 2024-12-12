// JavaScript code to fetch Guatemala volcano-related data from the USGS Earthquake API
async function fetchGuatemalaVolcanoData() {
    // Define the parameters for the API query
    const baseUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
    const params = {
        latitude: 14.6349,  // Central latitude of Guatemala
        longitude: -90.5069, // Central longitude of Guatemala
        maxradius: 2,        // Approx. 200 km (Adjust this to cover specific volcano areas)
        starttime: "2024-01-01", // Data starting from January 2024
        endtime: new Date().toISOString().split("T")[0], // Today's date
        minmagnitude: 1.5,  // Filter smaller seismic activities
    };

    // Build the query string
    const queryString = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");
    
    const apiUrl = `${baseUrl}&${queryString}`;
    
    const earthquakeContainer= document.getElementById('earthquakeContainer');
    const earthquakeData= document.getElementById('earthquake-data');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filter for Guatemala volcano region based on seismic activity
        const volcanoEvents = data.features.filter(event => {
            const [longitude,latitude] = event.geometry.coordinates;
            // Check proximity to key Guatemalan volcanoes (add more if needed)
            const volcanoes = [
                { name: "Pacaya", lat: 14.381, lon: -90.601 },
                { name: "Fuego", lat: 14.473, lon: -90.880 },
                { name: "Santiaguito", lat: 14.756, lon: -91.563 },
            ];

            return volcanoes.some(volcano => {
                const distance = Math.sqrt(
                    Math.pow(latitude - volcano.lat, 2) + Math.pow(longitude - volcano.lon, 2)
                );
                return distance < 0.2; // Approx. 20 km radius
            });

        });
        if (volcanoEvents===0) {
            earthquakeContainer.innerHTML="<p> No significant earthquakes recorded near Guatemala recently </p>";
        } else{
            //displaying the filter result
            earthquakeContainer.innerHTML= volcanoEvents.map(event=>`
                <div class = "Earthquake-Events"> 
                    <p><strong>Location: </strong>${event.properties.place}</p>
                    <p><strong>Magnitude: </strong>${event.properties.mag}</p>
                    <p><strong>Time: </strong>${new Date(event.properties.time).toLocaleString()}</p>
                </div>
            `).join("");
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        earthquakeContainer.innerHTML= "<p>Error loading earthquake data </p>"
    }
}

//calling the fucntion
document.addEventListener("DOMContentLoaded",fetchGuatemalaVolcanoData);