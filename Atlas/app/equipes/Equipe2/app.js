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

function updateLegend(layerId) {
    const legend = document.getElementById('legend');
    legend.innerHTML = ''; // Vider l'ancienne légende

    switch (layerId) {
        case 'Arret_Stationnement':
            legend.innerHTML = `
                <strong>Distance de stationnement</strong><br>
                <span style="background:green;width:10px;height:10px;display:inline-block;"></span> ≤ 100m<br>
                <span style="background:blue;width:10px;height:10px;display:inline-block;"></span> 100-300m<br>
                <span style="background:red;width:10px;height:10px;display:inline-block;"></span> > 300m<br>
            `;
            break;
        case 'Denssité_hexagon':
            legend.innerHTML = `
                <strong>Densité de stationnements</strong><br>
                <span style="background:#ffffcc;width:10px;height:10px;display:inline-block;"></span> 0-1.6<br>
                <span style="background:#ffeda0;width:10px;height:10px;display:inline-block;"></span> 1.6-9.7<br>
                <span style="background:#feb24c;width:10px;height:10px;display:inline-block;"></span> 9.7-18.7<br>
                <span style="background:#fd8d3c;width:10px;height:10px;display:inline-block;"></span> 18.7-29.4<br>
                <span style="background:#f03b20;width:10px;height:10px;display:inline-block;"></span> 29.4-36.1<br>
                <span style="background:#bd0026;width:10px;height:10px;display:inline-block;"></span> >36.1<br>
            `;
            break;
        case 'Nbres_de_places_et_heures_de_stationnement':
            legend.innerHTML = `
                <strong>Nombre de places</strong><br>
                <span style="background:rgb(240, 255, 31);width:10px;height:10px;display:inline-block;"></span> Symboles proportionnels au nombre de places<br>
            `;
            break;
        case 'Nbre_de_site':
            legend.innerHTML = `
                <strong>Nombre de sites</strong><br>
                <span style="background:#f7fbff;width:10px;height:10px;display:inline-block;"></span> 0<br>
                <span style="background:#deebf7;width:10px;height:10px;display:inline-block;"></span> 1-3<br>
                <span style="background:#c6dbef;width:10px;height:10px;display:inline-block;"></span> 3-5<br>
                <span style="background:#9ecae1;width:10px;height:10px;display:inline-block;"></span> 5-10<br>
                <span style="background:#6baed6;width:10px;height:10px;display:inline-block;"></span> 10-20<br>
                <span style="background:#3182bd;width:10px;height:10px;display:inline-block;"></span> 20-30<br>
                <span style="background:#08519c;width:10px;height:10px;display:inline-block;"></span> >30<br>
            `;
            break;
        default:
            legend.innerHTML = 'Sélectionnez une couche pour voir la légende.';
    }
}

// Fonctions de setup des sources
function setupArretStationnement() {
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        type: 'vector',
        tiles: [`https://curly-garbanzo-695594x5xq6q25q44-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf`]
    });
}

function setupDensiteHexagon() {
    map.addSource('RANL13299903.Denssité_hexagon-source', {
        type: 'vector',
        tiles: [`https://${codeSpaceID}-8801.app.github.dev/RANL13299903.Denssité_hexagon/{z}/{x}/{y}.pbf`]
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
                        ['get', 'distance_m_'], // <- ici "distance" est le champ dans ta donnée
                        'green',  // si distance <= 100
                        100, 'blue', // si distance > 100 et <= 300
                        300, 'red'   // si distance > 300 et <= 500
                        // tout ce qui est > 500m sera rouge aussi sauf si tu veux ajouter une 4e couleur
                    ],
                    'circle-opacity': 1
                }
            });
            break;
        case 'Denssité_hexagon':
            map.addLayer({
                'id': 'Denssité_hexagon',
                'type': 'fill',
                'source': 'RANL13299903.Denssité_hexagon-source',
                'source-layer': 'RANL13299903.Denssité_hexagon',
                'paint': {
    'fill-color': [
    'step',
    ['get', 'densité_stationnement'], 
    '#ffffcc',    // 0 à 1.6 : Jaune pâle
    1.6, '#ffeda0', // 1.6 à 9.7 : Jaune moyen
    9.7, '#feb24c', // 9.7 à 18.7 : Orange clair
    18.7, '#fd8d3c', // 18.7 à 29.4 : Orange foncé
    29.4, '#f03b20', // 29.4 à 36.1 : Rouge vif
    36.1, '#bd0026'  // >36.1 : Rouge très foncé
],
'fill-opacity': 0.7,
'fill-outline-color': 'gray'
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
                    'circle-color': "rgb(240, 255, 31)", 
                    'circle-opacity': 1,
                    
                    // 🎯 Variation dynamique du rayon en fonction de nbr_pla
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['get', 'nbr_pla'],
                        0, 2,     // 0 place = cercle de 2px
                        10, 5,    // 10 places = cercle de 5px
                        50, 10,   // 50 places = cercle de 10px
                        100, 15,  // 100 places = cercle de 15px
                        200, 20   // 200 places et + = cercle de 20px
                    ],
            
                    'circle-translate-anchor': 'map'
                }
            });
            // 🎯 Ajouter directement après : les étiquettes (labels)
    map.addLayer({
        id: 'Nbres_de_places_et_heures_de_stationnement-label',
        type: 'symbol',
        source: 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
        'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
        layout: {
            'text-field': ['get', 'nbr_pla'],
            'text-size': 12,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
        },
        paint: {
            'text-color': 'black',
            'text-halo-color': 'white',
            'text-halo-width': 1
        },
        
    });
            break;
        case 'Nbre_de_site':
            map.addLayer({
                'id': 'Nbre_de_site',
                'type': 'fill',
                'source': 'RANL13299903.Nbre_de_site-source',
                'source-layer': 'RANL13299903.Nbre_de_site',
                'paint': {
                    'fill-color': [
    'interpolate',
    ['linear'],
    ['get', 'nbre_site_stationnement'],
    0, '#f7fbff',    // Blanc bleuté
    1, '#deebf7',    // Bleu très clair
    3, '#c6dbef',    // Bleu clair
    5, '#9ecae1',    // Bleu moyen
    10, '#6baed6',   // Bleu plus foncé
    20, '#3182bd',   // Bleu foncé
    30, '#08519c'    // Bleu très foncé
],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'black'
                }
            });
            map.addLayer({
                'id': 'Nbre_de_site-label',
                'type': 'symbol',
                'source': 'RANL13299903.Nbre_de_site-source',
                'source-layer': 'RANL13299903.Nbre_de_site',
                'layout': {
                    'text-field': [
                        'to-string', ['get', 'nbre_site_stationnement']
                    ],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-offset': [0, 0], // Centré
                    'text-anchor': 'center'
                },
                'paint': {
                    'text-color': 'black',
                    'text-halo-color': 'white',
                    'text-halo-width': 1
                }
                ,'filter': ['>', ['get', 'nbre_site_stationnement'], 0]
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


map.on('click', 'Nbres_de_places_et_heures_de_stationnement', (e) => {
    const feature = e.features[0];

    const emplacement = feature.properties.emplacement || 'Emplacement non défini';
    const nombrePlaces = feature.properties.nbr_pla != null ? feature.properties.nbr_pla : 'Nombre inconnu';
    const heures = feature.properties.heures || 'Heures non précisées';
    const note = feature.properties.note_fr || '';

    new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
            <strong>Emplacement :</strong> ${emplacement}<br>
            <strong>Nombre de places :</strong> ${nombrePlaces}<br>
            <strong>Heures :</strong> ${heures}<br>
            <strong>Note :</strong> ${note}
        `)
        .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});