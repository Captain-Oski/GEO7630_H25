var map = new maplibregl.Map({
    container: 'map', // identifiant de l'élément HTML conteneur de la carte
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj', // URL du style de la carte
    center: [-73.55, 45.55], // position centrale de la carte
    zoom: 9, // niveau de zoom initial
    hash: true // activation du hash pour la gestion de l'historique de la carte
});

// https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson

map.on('load', () => {
    map.addSource('arrondissement-source', {
        'type': 'geojson',
        'data': 'https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson'
    });

    map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'arrondissement-source',
        'paint': {
            'fill-color': 'red',
            'fill-opacity': 0.8
       }
    });

    map.addLayer({
        'id': 'arr_line',
        'type': 'line',
        'source': 'arrondissement-source',
        'paint': {
            'line-color': 'white',
            'line-width': 2,
            'line-dasharray': [2, 4]
       }
    });
});


function ajouteParc () {
    // https://special-train-gv4r9g5gj4cvp7-8801.app.github.dev/BELM24339701.Patisserie_et_boulangerie/{z}/{x}/{y}.pbf
    if (!map.getSource('qt_arbres_quartier_source')) {

        map.addSource('qt_arbres_quartier_source', {
            type: 'vector',
            tiles: ['https://special-train-gv4r9g5gj4cvp7-8801.app.github.dev/public.densite_arbres_quartiers/{z}/{x}/{y}.pbf']
        });
    }

    if (map.getLayer('qt_arbres_quartier')) {
        map.removeLayer('qt_arbres_quartier');
      }
    else {
        map.addLayer({
            'id': 'qt_arbres_quartier',
            'type': 'fill',
            'source': 'qt_arbres_quartier_source',
            'source-layer': 'public.densite_arbres_quartiers'
        });
    }

}

function addCommerces () {
    var commercesSource = {
        type: 'geojson',
        data: 'https://donnees.montreal.ca/dataset/c1d65779-d3cb-44e8-af0a-b9f2c5f7766d/resource/ece728c7-6f2d-4a51-a36d-21cd70e0ddc7/download/businesses.geojson'
      };

      map.addSource('commerces-source', commercesSource) 

      
      // Définition de la couche avec symbologie par type de commerce
    var commercesLayer = {
        id: 'commerces',
        type: 'circle',
        source: 'commerces-source',
        paint: {
          // Rayon variable selon le type
          'circle-radius': 4,
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

      map.addLayer(commercesLayer)
} 
