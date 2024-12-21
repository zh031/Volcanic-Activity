// This is a function for fetching volcanic data from USGS
function fetchVolcanicData(){
    fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-01-01&endtime=2022-12-31&minmagnitude=2&maxlatitude=15&minlatitude=13&maxlongitude=-88&minlongitude=-92')
        .then(response => {
            console.log('http response', response.status);
            if (!response.ok){
                //error not for console
                throw new Error(`http error ${response.status}`);
            } return response.json();
        })
        // fetch multiple types of data 
        .then(data => { 
            console.log('data: ', data)
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
            
                console.log('place information', feature.properties.place || 'Unknown location');
                console.log('magnitude information', feature.properties.mag || 'Not applicable');

                const place = feature.properties.place || 'Unknown location';
                const magnitude = feature.properties.mag || 'Not applicable';
                const time = feature.properties.time ? new Date(features.properties.time).toLocaleString() : 'Unknwon time';

                const activityElement = document.createElement('div');
                activityElement.classList.add('volcano-acitivity');

                // displaying in HTML
                activityElement.innerHTML = `
                    <p><strong>Earthquake Activity Site</strong> ${place}</p>
                    <p><strong>Earthquake Magnitude</strong> ${magnitude}</p>
                    <p><strong>Earthquake Activity Duration</strong> ${time}</p>
                `;
                volcanoContainer.appendChild(activityElement);
            });
        })
        .catch(error => {
            console.error('error fetching volcanic data', error.message);
            const volcanoContainer = document.getElementById('volcanoContainer');
            volcanoContainer.innerHTML = '<p>Error in fetching volcano data</p>';


        });

}
fetchVolcanicData();