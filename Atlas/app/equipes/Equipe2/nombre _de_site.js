map.addSource('RANL13299903.Nbre_de_site-source', {
    'type': 'vector',
    'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Nbre_de_site/{z}/{x}/{y}.pbf"]

});
map.addLayer({
    'id': 'Nbre_de_site',
    'type': 'fill',
    'source': 'RANL13299903.Nbre_de_site-source',
    'source-layer': 'RANL13299903.Nbre_de_site',

    'paint': {
        "fill-color": "rgb(48, 91, 102)",
        "fill-opacity": 1,
        "fill-width": 1,
        "fill-translate-anchor": "map"
    }
    });
