let map; // Variable globale

// ========================
// Initialisation de la carte MapLibre
// ========================
map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
  center: [-73.68, 45.55],
  zoom: 9,
  hash: true
});

// Contrôles MapLibre
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
map.addControl(new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true,
  showUserHeading: true
}), 'top-left');
map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

// Split.js
Split(['#map', '#infoPanel'], {
  sizes: [66, 34],
  minSize: [300, 300],
  gutterSize: 8,
  snapOffset: 0
});

// Histogramme vide
const ctx = document.getElementById('histogram').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Distribution',
      data: [],
      backgroundColor: '#f87171'
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { display: true },
      y: { display: false }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

// ========================
// Couche Arrondissements via pg_featureserv (GeoJSON)
// ========================

let arrondissementLayerVisible = true; // État d'affichage

map.on('load', () => {
  fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.arrondissements/items?limit=10000')
    .then(res => res.json())
    .then(data => {
      map.addSource('arrondissements', {
        type: 'geojson',
        data: data
      });

      // Couche de fond (gris)
      map.addLayer({
        id: 'arrondissements-fill',
        type: 'fill',
        source: 'arrondissements',
        paint: {
          'fill-color': '#cccccc',
          'fill-opacity': 0.4
        },
        layout: {
          visibility: 'visible'
        }
      });

      // Couche de contour hachuré (bleu)
      map.addLayer({
        id: 'arrondissements-line',
        type: 'line',
        source: 'arrondissements',
        paint: {
          'line-color': '#4e5e7e',
          'line-width': 2,
          'line-dasharray': [2, 2]
        },
        layout: {
          visibility: 'visible'
        }
      });

      // Bouton toggle
      document.getElementById('toggleArrondissement').addEventListener('click', () => {
        arrondissementLayerVisible = !arrondissementLayerVisible;
        const visibility = arrondissementLayerVisible ? 'visible' : 'none';

        map.setLayoutProperty('arrondissements-fill', 'visibility', visibility);
        map.setLayoutProperty('arrondissements-line', 'visibility', visibility);
      });
    })
    .catch(err => {
      console.error('Erreur chargement GeoJSON arrondissements:', err);
    });
});
