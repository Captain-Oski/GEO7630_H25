var codeSpaceID = 'silver-journey-x5pp5vgv4rr53jj4'; // Pour associer l'ID du Codespace aux sources des layers À chaque changement de Codespace

console.log('TEST');

var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.55, 45.55],
    zoom: 9,
    hash: true
});

// Associer les sources aux ID des layers
const layersSources = {
    'Arret_Stationnement': 'RANL13299903.Arret_Stationnement-source',
    'Denssité_hexagon': 'RANL13299903.Denssité_hexagon-source',
    'Denssité_hexagon-3d': 'RANL13299903.Denssité_hexagon-source', // 3D utilise la même source que 2D
    'Nbres_de_places_et_heures_de_stationnement': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
    'Nbres_de_places_et_heures_de_stationnement-label': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source', // Label utilise la même source
    'Nbre_de_site': 'RANL13299903.Nbre_de_site-source',
    'Nbre_de_site-3d': 'RANL13299903.Nbre_de_site-source', // 3D utilise aussi la même source
    'Nbre_de_site-label': 'RANL13299903.Nbre_de_site-source', // Label aussi
    'buffer-arret-layer': 'buffer-arret-source' // Pour les buffers créés autour des arrêts
};

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


// Fonctionnalités lorsque la carte se charge à l'ouverture
map.on('load', function () {
    console.log('Carte chargée');
    // Pour que la couche Nbres_de_places_et_heures_de_stationnement soit chargé directement lorsque la carte commence à s'afficher
    if (!map.getSource(layersSources['Nbres_de_places_et_heures_de_stationnement'])) {
        setupPlacesStationnement();
    }

    addLayer('Nbres_de_places_et_heures_de_stationnement');
    updateLegend('Nbres_de_places_et_heures_de_stationnement');
});
// Fonction pour voir les couches directement lorsqu'on les fait apparaitre
function updateLegend(layerId) {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    if (!layerId) {
        legend.innerHTML = 'Sélectionnez une couche pour voir la légende.';
        return;
    }

    switch (layerId) {
        case 'Arret_Stationnement':
            legend.innerHTML = `
                <strong>Distance des arrets par rapport à un stationnement</strong><br>
                <span style="background:green;width:10px;height:10px;display:inline-block;"></span> ≤ 100m<br>
                <span style="background:blue;width:10px;height:10px;display:inline-block;"></span> 100-300m<br>
                <span style="background:red;width:10px;height:10px;display:inline-block;"></span> > 300m<br>
            `;
            break;
        case 'Denssité_hexagon':
        case 'Denssité_hexagon-3d':
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
                <span style="background:rgb(240,255,31);width:10px;height:10px;display:inline-block;"></span> Symboles proportionnels au nombre de places<br>
            `;
            break;
        case 'Nbre_de_site':
        case 'Nbre_de_site-3d':
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

// Fonctions de paramétrages des sources de chaque couche
function setupArretStationnement() {
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        type: 'vector',
        tiles: [`https://silver-journey-x5pp5vgv4rr53jj4-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf`]
    });
}
// CodespaceID s'adapte automatiquement au changement de codespace et permet d'appeler les couches depuis la base de données sans conflits
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


// Fonction générique pour toggler (Bouton faisant appel aux couches)
function toggleLayer(layerId, setupSourceFn) {
    const sourceId = layersSources[layerId];  // On récupère le bon source ID

    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        console.log('Layer retiré:', layerId);
        updateLegend(null);
    } else {
        // Vérifier l'existence réelle de la source avant de la recréer (Pour pouvoir réutiliser les boutons)
        if (!map.getSource(sourceId)) {
            setupSourceFn();
            console.log('Source créée:', sourceId);
        } else {
            console.log('Source déjà existante:', sourceId);
        }

        addLayer(layerId);
        console.log('Layer ajouté:', layerId);
        updateLegend(layerId);
    }
}


// Ajouter les couches
function addLayer(layerId) {
    switch (layerId) {
        case 'Arret_Stationnement':
            map.addLayer({
                'id': 'Arret_Stationnement',
                'type': 'circle',
                'source': 'RANL13299903.Arret_Stationnement-source',
                'source-layer': 'RANL13299903.Arret_Stationnement',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': [
                        'step',
                        ['get', 'distance_m_'],
                        'green',  // ≤100m
                        100, 'blue',  // 100–300m
                        300, 'red'    // >300m
                    ],
                    'circle-opacity': 1,
            
                    // 🧠 Nouveau : Couleur du contour
                    'circle-stroke-color': [
                        'case',
                        ['==', ['get', 'type_de_transport__0=bus_2=métro_'], 2], 
                        'black',     // Si métro ➔ contour noir
                        'transparent'  // Si bus ➔ pas de contour
                    ],
            
                    // 🧠 Nouveau : Épaisseur du contour
                    'circle-stroke-width': [
                        'case',
                        ['==', ['get', 'type_de_transport__0=bus_2=métro_'], 2],
                        2,   // Si métro ➔ contour de 2px
                        0    // Si bus ➔ aucun contour
                    ]
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
                        'interpolate',
                        ['linear'],
                        ['get', 'densité_stationnement'],
                        0, '#ffffcc',       // Très pâle pour 0
                        0.01, '#ffeda0',    // Dès 0.01
                        0.05, '#fed976',    // Dès 0.05
                        0.1, '#feb24c',     // Dès 0.1
                        0.2, '#fd8d3c',     // Dès 0.2
                        0.5, '#fc4e2a',     // Dès 0.5
                        1, '#e31a1c',       // Dès 1
                        2, '#bd0026'        // Dès 2 et plus
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'gray'
                }
            });


            // Néanmoins, pour cette couche, je n'arrive à graduer ses couleurs, je pense que c'est une erreur par rapport à son traitement sur FME
map.addLayer({
    'id': 'Denssité_hexagon-3d',
    'type': 'fill-extrusion',
    'source': 'RANL13299903.Denssité_hexagon-source',
    'source-layer': 'RANL13299903.Denssité_hexagon',
    'paint': {
        'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'densité_stationnement'],
            0, '#ffffcc',
            5, '#c2e699',
            10, '#78c679',
            20, '#31a354',
            30, '#006837'
        ],
        'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['get', 'densité_stationnement'],
            0, 0,
            5, 500,
            10, 1000,
            20, 2000,
            30, 3000
        ],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.7
    }
});
// Une visualisation en 2.5D pour la couche hexagon densité mais qui n'est pas visible à cause de la graduation de couleurs qui n'est pas ressortie
        

        break;
        case 'Nbres_de_places_et_heures_de_stationnement':
            map.addLayer({
                'id': 'Nbres_de_places_et_heures_de_stationnement',
                'type': 'circle',
                'source': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
                'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
                'paint': {
                    // 🎯 Variation dynamique de la couleur en fonction du nombre de places
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'nbr_pla'],
                        0, '#ffffcc',    // Très clair (presque jaune) pour 0
                        10, '#c2e699',   // Vert très clair pour petits parkings
                        50, '#78c679',   // Vert moyen
                        100, '#31a354',  // Vert plus foncé
                        200, '#006837'   // Très foncé pour les très grands parkings
                    ],
                    'circle-opacity': 1,
        
                    // 🎯 Variation dynamique du rayon en fonction du nombre de places
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
        
            map.addLayer({
                'id': 'Nbres_de_places_et_heures_de_stationnement-label',
                'type': 'symbol',
                'source': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
                'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
                'layout': {
                    'text-field': ['get', 'nbr_pla'],
                    'text-size': 12,
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top'
                },
                'paint': {
                    'text-color': 'black',
                    'text-halo-color': 'white',
                    'text-halo-width': 1
                }
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
                'id': 'Nbre_de_site-3d',
                'type': 'fill-extrusion',
                'source': 'RANL13299903.Nbre_de_site-source',
                'source-layer': 'RANL13299903.Nbre_de_site',
                'paint': {
                    'fill-extrusion-color': [
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
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['get', 'nbre_site_stationnement'],
                        0, 0,
                        1, 100,
                        3, 500,
                        5, 1000,
                        10, 2000,
                        20, 3000,
                        30, 4000
                    ],
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 0.8
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
 
// Fonction de clic sur les boutons des couches
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

// Affichage par clic sur les couches permettant d'avoir des informations sur les heures, l'emplacement des stationnements
map.on('click', 'Nbres_de_places_et_heures_de_stationnement', (e) => {
    const feature = e.features[0];

    const emplacement = feature.properties.emplacement || 'Emplacement non défini';
    const nombrePlaces = feature.properties.nbr_pla != null ? feature.properties.nbr_pla : 'Nombre inconnu';
    const heures = feature.properties.heures || 'Heures non précisées';
    const note = feature.properties.note_fr || '';

    new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
            <div style="
                background: #ffffff;
                padding: 15px;
                border-radius: 10px;
                font-family: 'Open Sans', sans-serif;
                font-size: 13px;
                color: #333;
                box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                max-width: 250px;
                line-height: 1.5;
            ">
                <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #0078A8;">
                    Informations sur le stationnement
                </h4>
                <p style="margin: 0;"><strong>📍 Emplacement :</strong><br> ${emplacement}</p>
                <p style="margin: 0;"><strong>🚗 Nombre de places :</strong> ${nombrePlaces}</p>
                <p style="margin: 0;"><strong>⏰ Heures de restriction :</strong><br> ${heures}</p>
                ${note ? `<p style="margin: 0;"><strong>📝 Note :</strong><br> ${note}</p>` : ''}
            </div>
        `)
        .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});

map.on('click', 'Arret_Stationnement', (e) => {
    const feature = e.features[0];
// Les informations à afficher sur le popup
    const emplacement = feature.properties.emplacement_stationnement || 'Emplacement non disponible';
    const nom_arret = feature.properties.nom_arret || 'Nom non disponible';
    const distance = feature.properties.distance_m_ != null ? feature.properties.distance_m_.toFixed(2) + ' m' : 'Distance inconnue';
    
    const type_transport = feature.properties['type_de_transport__0=bus_2=métro_'];
    
    // Pour définir le texte et la couleur selon le type de transport
    let typeText = 'Type inconnu';
    let popupColor = 'white'; // couleur par défaut

    if (type_transport === 0) {
        typeText = 'Arrêt de bus 🚌';
        popupColor = '#fff8b0'; // jaune pâle
    } else if (type_transport === 2) {
        typeText = 'Station de métro 🚇';
        popupColor = '#b0e0ff'; // bleu clair
    }

    new maplibregl.Popup({ 
        closeButton: true,
        closeOnClick: true,
    })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`
        <div class="popup-content" style="
            background-color: ${popupColor};
            padding: 10px;
            border-radius: 8px;
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: black;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
            <strong>Emplacement du stationnement :</strong> ${emplacement}<br>
            <strong>Nom de l'arrêt :</strong> ${nom_arret}<br>
            <strong>Distance :</strong> ${distance}<br>
            <strong>Type :</strong> ${typeText}
        </div>
    `)
    .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});

// Affichage par clic des popup pour connaitre l'arrondissement en question
map.on('click', 'Nbre_de_site', (e) => {
    const feature = e.features[0];

    const nom = feature.properties.nom || 'Nom non disponible';
    const nbre_sites = feature.properties.nbre_site_stationnement != null ? feature.properties.nbre_site_stationnement : 'Non précisé';

    const coordinates = e.lngLat;

    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
            <div style="background:white; padding:10px; border-radius:6px; box-shadow:0 0 5px rgba(0,0,0,0.3); font-family:'Open Sans', sans-serif; font-size:13px;">
                <strong>Arrondissement :</strong> ${nom}<br>
                <strong>Nombre de sites de stationnement :</strong> ${nbre_sites}
            </div>
        `)
        .addTo(map);

    map.flyTo({ center: coordinates, zoom: 12 });
});
// Fonction turf.js pour créer des buffers de 100m autour des stationnements
async function createBufferAroundArretStationnement() {
    console.log('Création du buffer autour des arrêts...');

    // 1. Récupérer toutes les features visibles de la couche
    const features = map.querySourceFeatures('RANL13299903.Arret_Stationnement-source', {
        sourceLayer: 'RANL13299903.Arret_Stationnement'
    });

    if (!features.length) {
        console.error('Aucun arrêt de stationnement trouvé.');
        return;
    }

    // 2. Construire un FeatureCollection GeoJSON
    const pointsGeojson = {
        type: "FeatureCollection",
        features: features.map(f => ({
            type: "Feature",
            geometry: f.geometry,
            properties: {}
        }))
    };

    // 3. Appliquer un buffer autour de chaque point avec Turf.js
    const buffered = turf.buffer(pointsGeojson, 100, { units: 'meters' }); // ex : 100 mètres autour

    // 4. Ajouter une nouvelle source et une couche pour le buffer
    if (map.getSource('buffer-arret-source')) {
        map.removeLayer('buffer-arret-layer');
        map.removeSource('buffer-arret-source');
    }

    map.addSource('buffer-arret-source', {
        type: 'geojson',
        data: buffered
    });

    map.addLayer({
        'id': 'buffer-arret-layer',
        'type': 'fill',
        'source': 'buffer-arret-source',
        'paint': {
            'fill-color': '#00FFFF',
            'fill-opacity': 0.3,
            'fill-outline-color': '#0077FF'
        }
    });

    console.log('Buffer ajouté sur la carte.');
}

document.getElementById('createBuffer').addEventListener('click', createBufferAroundArretStationnement);


// Bouton pour activer/désactiver les couches 2.5D de la couche nombres de sites/arrondissements
let is3DEnabled = false; // état initial

document.getElementById('toggle3D').addEventListener('click', function () {
    is3DEnabled = !is3DEnabled; // inverser l'état

    if (is3DEnabled) {
        // Si on active le 2.5D ➔ afficher les couches extrusion
        if (!map.getLayer('Nbre_de_site-3d')) {
            map.addLayer({
                'id': 'Nbre_de_site-3d',
                'type': 'fill-extrusion',
                'source': 'RANL13299903.Nbre_de_site-source',
                'source-layer': 'RANL13299903.Nbre_de_site',
                'paint': {
                    'fill-extrusion-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'nbre_site_stationnement'],
                        0, '#f7fbff',
                        1, '#deebf7',
                        3, '#c6dbef',
                        5, '#9ecae1',
                        10, '#6baed6',
                        20, '#3182bd',
                        30, '#08519c'
                    ],
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['get', 'nbre_site_stationnement'],
                        0, 0,
                        1, 100,
                        3, 500,
                        5, 1000,
                        10, 2000,
                        20, 3000,
                        30, 4000
                    ],
                    'fill-extrusion-opacity': 0.8
                }
            });
        }
    } else {
        // Sinon ➔ enlever la couche 3D
        if (map.getLayer('Nbre_de_site-3d')) {
            map.removeLayer('Nbre_de_site-3d');
        }
    }
});