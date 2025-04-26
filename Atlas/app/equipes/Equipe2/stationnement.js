map.addSource('RANL13299903.Nbres_de_places_et_heures_de_stationnement-source', { 
    
    'type': 'vector',

    'tiles': [ "https:https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Nbres_de_places_et_heures_de_stationnement/{z}/{x}/{y}.pbf"]


});

// Ajout de couche de type ______________ pour générer les stationnements

map.addLayer({

    'id': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',

    'type': 'circle',

    'source': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement-source',

    'source-layer': 'RANL13299903.Nbres_de_places_et_heures_de_stationnement',
// Dêfinition du style des couches 

'paint': {

"circle-color": "rgba(189, 19, 19, 1)", // utilisation des codes couleurs rouge, vert, bleu, alpha pour styliser la couche

"circle-opacity": 1, // Opacité de 1 = 100%

"circle-width": 1, // largeur =1

"circle-translate-anchor": "map" // 

    }

});

