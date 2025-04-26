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
            "fill-color": "rgb(48, 91, 102)",
            "fill-opacity": 0.7,
            "fill-outline-color": "black"
        }
    });
});
