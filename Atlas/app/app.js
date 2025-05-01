// création de la carte Mapbox GL
var map = new maplibregl.Map({
    container: 'map', // identifiant de l'élément HTML conteneur de la carte
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj', // URL du style de la carte
    center: [-73.55, 45.55], // position centrale de la carte
    zoom: 9, // niveau de zoom initial
    hash: true // activation du hash pour la gestion de l'historique de la carte
});

function loadTeam(teamName) {
    // Vider toutes les divs
    document.getElementById('Equipe1').innerHTML = '';
    document.getElementById('Equipe2').innerHTML = '';
    document.getElementById('Equipe3').innerHTML = '';
    document.getElementById('Equipe4').innerHTML = '';
    document.getElementById('Equipe5').innerHTML = '';
    // Charger le contenu de l'équipe sélectionnée

    const path = teamName === 'Accueil' 
    ? './index.html' 
    : `./equipes/${teamName}/index.html`;

    fetch(path)
        .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
        })
        .then(data => {
        document.getElementById(teamName).innerHTML = data;
        })
        .catch(error => {
        console.error('There was a problem with fetching the team content:', error);
        });

    }


map.addControl(new maplibregl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true
}), 'top-right');
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
}), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}), 'bottom-left');

map.on('load', function () {
 
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        'type': 'vector',
        'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf"]

    });
    map.addLayer({
        'id': 'Arret_Stationnement',
        'type': 'circle',
        'source': 'RANL13299903.Arret_Stationnement-source',
        'source-layer': 'RANL13299903.Arret_Stationnement',

        'paint': {
            'circle-radius': 5, // Rayon du cercle
            'circle-color': 'rgb(10, 67, 80)', // Couleur du cercle
            'circle-opacity': 1 // Opacité du cercle
        }
    });
});