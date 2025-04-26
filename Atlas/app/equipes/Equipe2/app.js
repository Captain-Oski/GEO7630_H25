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


map.on('load', function () {
    // Source Arrêt de Stationnement
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
            'circle-color': [
                'step',
                ['get', 'distance'],
                'green',
                100, 'blue',
                300, 'red'
            ],
            'circle-opacity': 1
        }
    });

    // Source Densité Hexagonale
    map.addSource('RANL13299903.Denssité_hexagon-source', { // <- attention au "-source"
        'type': 'vector',
        'tiles': [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Denssité_hexagon/{z}/{x}/{y}.pbf`
            ]
    });

    map.addLayer({
        'id': 'Denssité_hexagon',
        'type': 'fill',
        'source': 'RANL13299903.Denssité_hexagon-source',
        'source-layer': 'RANL13299903.Denssité_hexagon',
        'paint': {
            'fill-color': 'rgb(245, 111, 8)',
            'fill-opacity': 1
        }
    });

    map.addSource('RANL13299903.Nbres_de_places_et_heures_de_stationnement-source', { 
        'type': 'vector',
        'tiles': [ 
            "https://curly-garbanzo-695594x5xq6q25q44-8801.app.github.dev/RANL13299903.Nbres_de_places_et_heures_de_stationnement/{z}/{x}/{y}.pbf"
        ]
    });
    // Ajout de couche de type ______________ pour générer les stationnements
    
    map.addLayer({
        'id': 'Nbres_de_places_et_heures_de_stationnement',
        'type': 'circle',
        'source': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
        'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
        'paint': {
            "circle-color": "rgba(189, 19, 19, 1)", // rouge foncé
            "circle-opacity": 1,                     // 100% opaque
            "circle-radius": 5,                      // Rayon du cercle en pixels
            "circle-translate-anchor": "map"          // Ancrage du déplacement
        }
    });
    map.addSource('RANL13299903.Nbre_de_site-source', {
        'type': 'vector',
        'tiles': [
            "https://curly-garbanzo-695594x5xq6q25q44-8801.app.github.dev/RANL13299903.Nbre_de_site/{z}/{x}/{y}.pbf"
        ]
    });

    map.addLayer({
        'id': 'Nbre_de_site',
        'type': 'fill',
        'source': 'RANL13299903.Nbre_de_site-source',
        'source-layer': 'RANL13299903.Nbre_de_site',
        'paint': {
            "fill-color": "rgb(48, 91, 102)",
            "fill-opacity": 0.7,
            "fill-outline-color": "black"
        }
    });
});
