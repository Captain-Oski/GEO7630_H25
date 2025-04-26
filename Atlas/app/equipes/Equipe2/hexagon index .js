map.addSource('RANL13299903.Denssité_hexagon', {
    'type': 'vector',
    'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Denssit%C3%A9_hexagon/{z}/{x}/{y}.pbf"]

});
map.addLayer({
    'id': 'Denssité_hexagon',
    'type': 'fill',
    'source': 'RANL13299903.Denssité_hexagon-source',
    'source-layer': 'RANL13299903.Denssité_hexagon',

    'paint': {
        "fill-color": "rgb(245, 111, 8)",
        "fill-opacity": 1,
        "fill-width": 1,
        "fill-translate-anchor": "map"
    }
    });
