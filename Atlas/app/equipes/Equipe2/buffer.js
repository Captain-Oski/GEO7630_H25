async function createBufferAroundArretStationnement() {
    console.log('Création du buffer autour des arrêts...');

    // 1. Récupérer toutes les features visibles de ta couche
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