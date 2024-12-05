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

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filter for Guatemala volcano region based on seismic activity
        const volcanoEvents = data.features.filter(event => {
            const coords = event.geometry.coordinates;
            const longitude = coords[0];
            const latitude = coords[1];
            
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

        // Log volcano events
        console.log(`Found ${volcanoEvents.length} events near Guatemala volcanoes.`);
        volcanoEvents.forEach(event => {
            console.log(`Location: ${event.properties.place}`);
            console.log(`Magnitude: ${event.properties.mag}`);
            console.log(`Time: ${new Date(event.properties.time).toLocaleString()}`);
            console.log("---------------------------");
        });
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}