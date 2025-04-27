var codeSpaceID = 'curly-garbanzo-695594x5xq6q25q44';

console.log('TEST');

var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.55, 45.55],
    zoom: 9,
    hash: true
});

function loadTeam(teamName) {
    ['Equipe1', 'Equipe2', 'Equipe3', 'Equipe4', 'Equipe5'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });

    const path = teamName === 'Accueil' ? './index.html' : `./equipes/${teamName}/index.html`;

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

// Contrôles de navigation, géolocalisation et échelle
map.addControl(new maplibregl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true
}), 'top-right');

map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
}), 'bottom-right');

map.addControl(new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}), 'bottom-left');

map.on('load', function () {
    console.log('Carte chargée');
});

// Fonctions de setup des sources
function setupArretStationnement() {
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        type: 'vector',
        tiles: [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf`]
    });
}

function setupDensiteHexagon() {
    map.addSource('RANL13299903.Denssité_hexagon-source', {
        type: 'vector',
        tiles: [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Densséité_hexagon/{z}/{x}/{y}.pbf`]
    });
}

function setupPlacesStationnement() {
    map.addSource('RANL13299903.Nbres_de_places_et_heures_de_stationnement-source', {
        type: 'vector',
        tiles: [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Nbres_de_places_et_heures_de_stationnement/{z}/{x}/{y}.pbf`]
    });
}

function setupNbreDeSite() {
    map.addSource('RANL13299903.Nbre_de_site-source', {
        type: 'vector',
        tiles: [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Nbre_de_site/{z}/{x}/{y}.pbf`]
    });
}

// Fonction générique pour toggler
function toggleLayer(layerId, setupSourceFn) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        console.log('Layer retiré:', layerId);
    } else {
        if (!map.getSource(layerId + '-source')) {
            setupSourceFn();
        }
        addLayer(layerId);
    }
}

// Ajouter les couches
function addLayer(layerId) {
    switch (layerId) {
        case 'Arret_Stationnement':
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
                        'green', 100,
                        'blue', 300,
                        'red'
                    ],
                    'circle-opacity': 1
                }
            });
            break;
        case 'Denssité_hexagon':
            map.addLayer({
                id: 'Denssité_hexagon',
                type: 'fill',
                source: 'RANL13299903.Denssité_hexagon-source',
                'source-layer': 'RANL13299903.Denssité_hexagon',
                paint: {
                    'fill-color': 'rgb(245, 111, 8)',
                    'fill-opacity': 1
                }
            });
            break;
        case 'Nbres_de_places_et_heures_de_stationnement':
            map.addLayer({
                id: 'Nbres_de_places_et_heures_de_stationnement',
                type: 'circle',
                source: 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
                'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
                paint: {
                    'circle-color': 'rgba(189, 19, 19, 1)',
                    'circle-opacity': 1,
                    'circle-radius': 5,
                    'circle-translate-anchor': 'map'
                }
            });
            break;
        case 'Nbre_de_site':
            map.addLayer({
                id: 'Nbre_de_site',
                type: 'fill',
                source: 'RANL13299903.Nbre_de_site-source',
                'source-layer': 'RANL13299903.Nbre_de_site',
                paint: {
                    'fill-color': 'rgb(48, 91, 102)',
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'black'
                }
            });
            break;
    }
}

// Lier les boutons aux actions

document.getElementById('toggleArretStationnement').addEventListener('click', function () {
    toggleLayer('Arret_Stationnement', setupArretStationnement);
});

document.getElementById('toggleDensiteHexagon').addEventListener('click', function () {
    toggleLayer('Denssité_hexagon', setupDensiteHexagon);
});

document.getElementById('togglePlacesStationnement').addEventListener('click', function () {
    toggleLayer('Nbres_de_places_et_heures_de_stationnement', setupPlacesStationnement);
});

document.getElementById('toggleNbreDeSite').addEventListener('click', function () {
    toggleLayer('Nbre_de_site', setupNbreDeSite);
});
