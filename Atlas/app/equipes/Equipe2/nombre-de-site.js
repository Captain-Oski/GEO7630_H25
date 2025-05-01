map.on('load', function() {
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
// COuche en 2.5D avec la hauteur selon le nombre de stationnement
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
});
