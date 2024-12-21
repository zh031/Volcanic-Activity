function fetchGuatemalaVolcanicData() {
    // URL for real-time volcanic/seismic event data focused on Guatemala's region
    const apiUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-12-31&minmagnitude=4&maxlatitude=15&minlatitude=13&maxlongitude=-88&minlongitude=-92';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const volcanoContainer = document.getElementById('volcanoContainer');
            volcanoContainer.innerHTML = '';

            if (data.features.length === 0) {
                volcanoContainer.innerHTML = '<p>No significant volcanic activity recorded in Guatemala.</p>';
                return;
            }

            data.features.forEach(feature => {
                const place = feature.properties.place || 'Unknown location';
                const magnitude = feature.properties.mag || 'Not applicable';
                const time = feature.properties.time ? new Date(feature.properties.time).toLocaleString() : 'Unknown time';

                const volcanoElement = document.createElement('div');
                volcanoElement.classList.add('volcano-activity');

                volcanoElement.innerHTML = `
                    <p><strong>Volcano Activity Location:</strong> ${place}</p>
                    <p><strong>Magnitude:</strong> ${magnitude}</p>
                    <p><strong>Event Time:</strong> ${time}</p>
                `;
                volcanoContainer.appendChild(volcanoElement);
            });
        })
        .catch(error => {
            console.error('Error fetching volcanic data:', error.message);
            const volcanoContainer = document.getElementById('volcanoContainer');
            volcanoContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

fetchGuatemalaVolcanicData();
