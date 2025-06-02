//initialize map, centers map to Guatemala
const map = L.map('map').setView([15.7835, -90.2308], 7);
//add openstreetmaptile
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//list of the volcanoes with thier name and coordinates
const volcanoes = [
    { name: "Pacaya", coords: [14.3811, -90.6011] },
    { name: "Fuego", coords: [14.4733, -90.8808] },
    { name: "Santiaguito", coords: [14.7568, -91.5526] },
    { name: "Atitlán", coords: [14.6291, -91.1985] }
];

// collects distance in km
const VEIdistances ={1:5, 2:10, 3:20, 4:40, 5:100};

volcanoes.forEach(volcano => {
    L.marker(volcano.coords)
        .addTo(map)
        .bindPopup(`<strong>${volcano.name}</strong>`);
});

//function to draw circle based on distance
function drawImpactCircle(VEIlevel)


