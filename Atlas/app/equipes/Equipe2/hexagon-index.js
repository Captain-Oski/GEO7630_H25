map.on('load', function () {
    map.addSource('RANL13299903.Denssité_hexagon-source', {
        'type': 'vector',
        'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Denssité_hexagon/{z}/{x}/{y}.pbf"]
    
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
});
