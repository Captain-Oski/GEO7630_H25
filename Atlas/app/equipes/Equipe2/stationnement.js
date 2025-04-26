map.on('load', function () {

    map.addSource('RANL13299903.Nbres_de_places_et_heures_de_stationnement-source', { 
        'type': 'vector',
        'tiles': [ 
            "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Nbres_de_places_et_heures_de_stationnement/{z}/{x}/{y}.pbf"
        ]
    });

    map.addLayer({
        'id': 'Nbres_de_places_et_heures_de_stationnement',
        'type': 'circle',
        'source': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',
        'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
        'paint': {
            "circle-color": "rgba(189, 19, 19, 1)", // rouge foncé
            "circle-opacity": 1,                     // 100% opaque
            "circle-radius": 5,                      // Rayon du cercle en pixels
            "circle-translate-anchor": "map"          // Ancrage du déplacement
        }
    });

});