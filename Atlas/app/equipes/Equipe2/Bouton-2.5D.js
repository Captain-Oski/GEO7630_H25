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