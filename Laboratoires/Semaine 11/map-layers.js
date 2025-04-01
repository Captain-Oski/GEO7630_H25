// Définition de la source GeoJSON
var commercesSource = {
    type: 'geojson',
    data: 'https://donnees.montreal.ca/dataset/c1d65779-d3cb-44e8-af0a-b9f2c5f7766d/resource/ece728c7-6f2d-4a51-a36d-21cd70e0ddc7/download/businesses.geojson'
  };
  
  // Définition de la couche avec symbologie par type de commerce
  var commercesLayer = {
    id: 'commerces',
    type: 'circle',
    source: 'commerces_source',
    paint: {
      // Rayon variable selon le type
      'circle-radius': [
        'match',
        ['get', 'type'],
        'Épicerie', 5,
        'Pâtisserie/Boulangerie', 7,
        'Distributrice automatique', 4,
        'Pharmacie', 6,
        'Restaurant', 5,
        3 // taille par défaut
      ],
      // Couleur variable selon le type
      'circle-color': [
        'match',
        ['get', 'type'],
        'Épicerie', 'orange',
        'Pâtisserie/Boulangerie', 'yellow',
        'Distributrice automatique', 'blue',
        'Pharmacie', 'green',
        'Restaurant', 'purple',
        'grey' // couleur par défaut
      ],
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1
    },
    filter: ['==', ['get', 'statut'], 'Ouvert']
  };

// Source GeoJSON des arrondissements (via données ouvertes ou autres)
// var arrondissementsSource = {
//   type: 'geojson',
//   data: 'https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson'
// };

// // Couche de type "fill" pour les arrondissements
// var arrondissementsLayer = {
//   id: 'arrondissements',
//   type: 'fill',
//   source: 'arrondissements-source',
//   paint: {
//     'fill-outline-color': 'black',
//     'fill-color': 'white', // couleur aléatoire à chaque chargement
//     'fill-opacity': 0.2
//   }
//   // NB: 'before' est une option de `map.addLayer()`, pas dans l'objet layer
// };

var arrondissementsSource = {
  type: 'geojson',
  data: 'https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson'
};
 
var arrondissementsLayer = {
  id: 'arrondissements',
  type: 'fill',
  source: 'arrondissementsSource', // Assurez-vous que le nom de la source correspond ici
  paint: {
    'fill-color': '#ccc',
    'fill-opacity': 0.3,
    'fill-outline-color': '#000'
  }
};

var arrondissementsLabelsLayer = {
    id: 'arrondissements-labels',
    type: 'symbol',
    source: 'arrondissements-source',
    layout: {
      'text-field': ['get', 'NOM'], // ou 'nom_offici'
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#111',
      'text-halo-color': '#fff',
      'text-halo-width': 1.5
    },
    maxzoom: 13 // affiché jusqu'au zoom 13 inclus
  };