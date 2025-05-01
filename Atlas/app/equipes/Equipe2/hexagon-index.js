hexagon-index.js
map.on('load', function () {
    map.addSource('RANL13299903.Denssité_hexagon-source', {
        'type': 'vector',
        'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Denssité_hexagon/{z}/{x}/{y}.pbf"]
    // Néanmoins, pour cette couche, je n'arrive à graduer ses couleurs, je pense que c'est une erreur par rapport à son traitement sur FME
    });
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
// Une visualisation en 2.5D mais qui n'est pas visible à cause de la graduation de couleurs qui n'est pas ressortie    
});
