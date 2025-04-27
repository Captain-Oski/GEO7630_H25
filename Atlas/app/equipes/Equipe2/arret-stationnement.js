map.addLayer({
    'id': 'Arret_Stationnement',
    'type': 'circle',
    'source': 'RANL13299903.Arret_Stationnement-source',
    'source-layer': 'RANL13299903.Arret_Stationnement',
    'paint': {
        'circle-radius': 5,
        'circle-color': [
            'step',
            ['get', 'distance_m_'],
            'green',  // ≤100m
            100, 'blue',  // 100–300m
            300, 'red'    // >300m
        ],
        'circle-opacity': 1,

        // 🧠 Nouveau : Couleur du contour
        'circle-stroke-color': [
            'case',
            ['==', ['get', 'type_de_transport__0=bus_2=métro_'], 2], 
            'black',     // Si métro ➔ contour noir
            'transparent'  // Si bus ➔ pas de contour
        ],

        // 🧠 Nouveau : Épaisseur du contour
        'circle-stroke-width': [
            'case',
            ['==', ['get', 'type_de_transport__0=bus_2=métro_'], 2],
            2,   // Si métro ➔ contour de 2px
            0    // Si bus ➔ aucun contour
        ]
    }
});
