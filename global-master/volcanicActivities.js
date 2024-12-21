// This is a function for fetching volcanic data from USGS
function fetchVolcanicData(){
    fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-01-01&endtime=2022-12-31&minmagnitude=2&maxlatitude=15&minlatitude=13&maxlongitude=-88&minlongitude=-92')
        .then(response => response.json())
        // fetch multiple types of data 
        .then(data => { 
            const volcanoContainer= document.getElementById('volcanoContainer');

            //Clear existing data inside volcanicContainer
            volcanoContainer.innerHTML = '';

            //Check if data(from line 6) exists 
            if (data.features.length === 0) {
                volcanoContainer.innerHTML = '<p>No significant volcanic activity recorded</p>';
                return;
            }

            //Only runs when data exists ( is not equal to 0)
             

            data.features.forEach(feature => {
                console.log('volcanic activity in Guatemala');
                console.log('location: ' + feature.properties.place);
                console.log('magnitude: ' + feature.properties.mag);
                console.log('time: ' + new Date(features.properties.time).toLocaleString());
            });
        })
        .catch(error => {
            console.error('error fetching volcanic data',error);
        });

    const volcanoData= document.getElementById('volcanoData');
}
fetchVolcanicData();