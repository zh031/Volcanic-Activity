// This is a function for fetching volcanic data from USGS
function fetchVolcanicData(){
    fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-01-01&endtime=2022-12-31&minmagnitude=2&maxlatitude=15&minlatitude=13&maxlongitude=-88&minlongitude=-92')
        .then(response => response.json())
        // fetch multiple types of data 
        .then(data => {
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

    const volcanoContainer= document.getElementById('volcanoContainer');
    const volcanoData= document.getElementById('volcanoData');
}
fetchVolcanicData();