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

});
