async function fetchGuatemalaVolcanoData() 
{
    const baseUrl= "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
    const parameters= 
    {
        latitude: 14.6349,
        longitude: -90.5069,
        // define area to cover in terms of volcanic area ( 200km)
        maxRadius: 2,
        starttime: "2024-01-01",
        //automatically provides today's date
        endtime: new Date().toISOString().split("T")[0],
        // minimum magnitidue filters smaller seismeic activities; can be modified later
        minMagnitude: 1.5,
    };

    // gets map information. Map info comes from keys parameters 
    const queryString= Object.keys(parameters)
        .map(key => `${key}=${params[key]}`)
        .join("&");

    // specifies provided website; detailed parameters
    const apiUrl= `${baseUrl}&${queryString}`;
    
    try{
        const response= await fetch(apiUrl);
        //try to get that information

        if(!response.ok){
            throw new Error('failed to fetch data');
        }
    }

    const data = await response.json();
    const volcanoEvents = data.features.filter(event=> {
    
        const coordinates = events.geometry.coordinates;
        const longitude = coordinates[0];
        const latitude = coordinates [1];

        const volcanoes = [
            {
                name:"Pacaya", lat: 14.381, long: -90.601
            },

            {
                name:"Fuego", lat: 14.473, long: -90.880
            },

            {
                name:"Santiaguito", lat: 14.756, long: -91.563
            },
        ];
        

        return volcanoes.some(volcano => {
        const distance = Math.sqrt(Math.pow(latitude - volcano.lat, 2) + Math.pow(longitude - volcano.lon, 2));
        return distance < 0.2;
        });
    });   
        //logging all the volcano events
        console.log('found ${volcanoEvents.length} Events near Guatemala volcanoes');
        volcanoEvents.forEach(event => {
           console.log('Location: ${event.properties.place}');
           console.log('Magnitude: ${event.properties.mag}');
           console.log('Time: ${new Date(event.properties.time).toLocaleString()}');
           console.log("---------------------------------------------------------");
        });

    

}