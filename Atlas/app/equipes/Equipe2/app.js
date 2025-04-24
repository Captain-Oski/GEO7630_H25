// Ici on déclare notre identifiant de codespace personnel 
// A noter qu'a chaque fois que je démarre UN NOUVEAU codespace l'identifiant change
// Cet identifiant se situe dans l'URL du codespace
var codeSpaceID = 'curly-garbanzo-695594x5xq6q25q44'

console.log('TEST')
var map = new maplibregl.Map({
    container: 'map', 
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.55, 45.55],
    zoom: 9,
    hash: true
});

function loadTeam(teamName) {
    // Vider toutes les divs
    ['Equipe1', 'Equipe2', 'Equipe3', 'Equipe4', 'Equipe5'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });

    // Construire le chemin selon le nom de l'équipe
    const path = teamName === 'Accueil'
        ? './index.html'
        : `./equipes/${teamName}/index.html`; // <-- backticks obligatoires ici

    // Charger dynamiquement le contenu
    fetch(path)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(teamName);
            if (container) {
                container.innerHTML = data;
            } else {
                console.error(`Element with ID '${teamName}' not found.`);
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement du contenu :', error);
        });
}

// Ajout des contrôles de navigation, géolocalisation et échelle
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

// Chargement de la source vectorielle et ajout d'une couche
map.on('load', function () {
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        type: 'vector',
        tiles: [
            `https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf`
        ]
    });

    map.addLayer({
        id: 'Arret_Stationnement',
        type: 'circle',
        source: 'RANL13299903.Arret_Stationnement-source',
        'source-layer': 'RANL13299903.Arret_Stationnement',
        paint: {
            'circle-radius': 5,
            'circle-color': 'rgb(10, 67, 80)',
            'circle-opacity': 1
        }
    });
});
