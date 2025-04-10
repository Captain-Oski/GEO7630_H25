/**********************************************
 * EXEMPLE COMPLET - INTERACTIF Style CensusMapper
 * 1) MVT pour l'affichage choroplèthe
 * 2) GeoJSON complet pour histogramme réel
 * 3) Légende dynamique
 * 4) Barres colorées
 * 5) Click sur barre => Highlight sur la carte
 **********************************************/

// ========================
// 0) INITIALISATION CARTE
// ========================
let map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
  center: [-73.68, 45.55],
  zoom: 9,
  hash: true
});

// Contrôles MapLibre
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  }),
  'top-left'
);
map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

// Split.js (division carte / panneau)
Split(['#map', '#infoPanel'], {
  sizes: [66, 34],
  minSize: [300, 300],
  gutterSize: 8,
  snapOffset: 0
});

// ========================
// 1) CHART.JS HISTOGRAM
// ========================
const ctx = document.getElementById('histogram').getContext('2d');
const histogram = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Distribution',
        data: [],
        backgroundColor: [] // sera rempli dynamiquement
      }
    ]
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

// ===============================
// 2) Variables Globales
// ===============================
let currentLayerId = null;
let currentVariable = null;
let currentBreaks = null;     // Pour mémoriser les seuils de la variable
let currentFullColors = null; // Pour mémoriser la palette complète
let arrondissementLayerVisible = true;
let statsFeatures = [];       // Stockage des features (GeoJSON complet)


// ===============================
// 3) Évènements "map.on('load')"
// ===============================
map.on('load', () => {
  // (A) Charger le GeoJSON des arrondissements
  fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.arrondissements/items?limit=10000')
    .then(res => res.json())
    .then(data => {
      map.addSource('arrondissements', { type: 'geojson', data });
      // fill
      map.addLayer({
        id: 'arrondissements-fill',
        type: 'fill',
        source: 'arrondissements',
        paint: { 'fill-color': '#cccccc', 'fill-opacity': 0.4 },
        layout: { visibility: 'visible' }
      });
      // line
      map.addLayer({
        id: 'arrondissements-line',
        type: 'line',
        source: 'arrondissements',
        paint: { 'line-color': '#4e5e7e', 'line-width': 2, 'line-dasharray': [2, 2] },
        layout: { visibility: 'visible' }
      });
      // Toggle
      document
        .getElementById('toggleArrondissement')
        .addEventListener('click', () => {
          arrondissementLayerVisible = !arrondissementLayerVisible;
          const visibility = arrondissementLayerVisible ? 'visible' : 'none';
          map.setLayoutProperty('arrondissements-fill', 'visibility', visibility);
          map.setLayoutProperty('arrondissements-line', 'visibility', visibility);
        });
    });

  // (B) Source MVT pour la carte
  map.addSource('recensement2021', {
    type: 'vector',
    tiles: [
      'https://literate-telegram-x57676p4rjrfvw6p-8801.app.github.dev/MBAI89260004.Stat_2021_mtl/{z}/{x}/{y}.pbf'
    ],
    minzoom: 0,
    maxzoom: 14
  });

  // (C) Charger TOUTES les features en GeoJSON pour calculer histogram
  //     Adapte l’URL si besoin (pg_featureserv, etc.)
  fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.Stat_2021_mtl/items?limit=10000')
    .then(r => r.json())
    .then(fullData => {
      statsFeatures = fullData.features;
      console.log('✅ Stat_2021_mtl (GeoJSON) chargé :', statsFeatures.length, 'features');
    });
});

// ========================
// 4) Palettes
// ========================
const variablePalettes = {
  revenu_median_menages: [
    '#f7fcf0','#e5f5f9','#ccece6','#99d8c9',
    '#66c2a4','#41ae76','#238b45','#006d2c','#00441b'
  ],
  revenu_median_individus: [
    '#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda',
    '#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b'
  ],
  taux_chomage: [
    '#f7f4f9','#e7e1ef','#d4b9da','#c994c7',
    '#df65b0','#e7298a','#ce1256','#980043','#67001f'
  ],
  taux_diplomes_universitaires: [
    '#fff7ec','#fee8c8','#fdd49e','#fdbb84',
    '#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'
  ],
  densite_pop: [
    '#fff7fb','#ece7f2','#d0d1e6','#a6bddb',
    '#74a9cf','#3690c0','#0570b0','#045a8d','#023858'
  ]
};

// ========================
// 5) updateChoropleth()
// ========================
function updateChoropleth(variable) {
  // 5A) Si on reclique la même variable => on enlève la couche
  if (currentVariable === variable) {
    if (currentLayerId && map.getLayer(currentLayerId)) {
      map.removeLayer(currentLayerId);
      // enlever highlight-layer aussi s’il existe
      if (map.getLayer('highlight-layer')) {
        map.removeLayer('highlight-layer');
      }
      // reset
      currentLayerId = null;
      currentVariable = null;
      currentBreaks = null;
      currentFullColors = null;
      // vider histogramme
      histogram.data.labels = [];
      histogram.data.datasets[0].data = [];
      histogram.data.datasets[0].backgroundColor = [];
      histogram.update();
      // enlever légende
      document.getElementById('legendChoropleth').innerHTML = '';
      // retirer events survol
      map.off('mousemove', currentLayerId, onHover);
      map.off('mouseleave', currentLayerId, onLeave);
    }
    return;
  }

  // 5B) Nouvelle variable
  currentVariable = variable;

  // Palette
  const colors = variablePalettes[variable] || ['#ccc'];
  
  // Seuils
  let breaks;
  switch (variable) {
    case 'revenu_median_menages':
      breaks = [40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000];
      break;
    case 'revenu_median_individus':
      breaks = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000];
      break;
    case 'densite_pop':
      breaks = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];
      break;
    case 'taux_chomage':
    case 'taux_diplomes_universitaires':
    default:
      breaks = [5, 10, 15, 20, 25, 30, 35, 40];
  }

  // Équilibrer la palette
  const fullColors = [...colors];
  while (fullColors.length < breaks.length + 1) {
    fullColors.push(colors[colors.length - 1]);
  }

  // Stocker globalement pour le highlight & histogram
  currentBreaks = breaks;
  currentFullColors = fullColors;

  // Expression step
  const propertyExpr = ['get', variable];
  const stepExpr = ['step', propertyExpr, fullColors[0]];
  for (let i = 0; i < breaks.length; i++) {
    stepExpr.push(breaks[i], fullColors[i + 1]);
  }

  // Retirer ancienne couche si existante
  if (currentLayerId && map.getLayer(currentLayerId)) {
    map.removeLayer(currentLayerId);
    if (map.getLayer('highlight-layer')) map.removeLayer('highlight-layer');
    map.off('mousemove', currentLayerId, onHover);
    map.off('mouseleave', currentLayerId, onLeave);
  }

  // ID
  currentLayerId = `recensement-${variable}`;

  // Ajouter la couche
  map.addLayer({
    id: currentLayerId,
    type: 'fill',
    source: 'recensement2021',
    'source-layer': 'MBAI89260004.Stat_2021_mtl',
    paint: {
      'fill-color': stepExpr,
      'fill-opacity': 0.7,
      'fill-outline-color': '#ccc'
    }
  });

  // Couche highlight (initialement vide)
  map.addLayer({
    id: 'highlight-layer',
    type: 'fill',
    source: 'recensement2021',
    'source-layer': 'MBAI89260004.Stat_2021_mtl',
    paint: {
      'fill-color': '#ffffff',
      'fill-opacity': 0.3,
      'fill-outline-color': '#000'
    },
    filter: ['==', ['get', variable], '___none___'] // Filtre bidon
  });

  // Survol
  map.on('mousemove', currentLayerId, onHover);
  map.on('mouseleave', currentLayerId, onLeave);

  // (A) Mettre à jour l’histogramme réel
  updateHistogramReal(variable, breaks, fullColors);

  // (B) Générer la légende
  updateLegend(fullColors, breaks);
}

// ========================
// 6) Survol : tooltip
// ========================
function onHover(e) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  const props = e.features[0].properties;

  let html = `<strong>${variableLabels[currentVariable] || currentVariable}</strong><br/>`;
  for (const k in props) {
    html += `<div><strong>${k}</strong>: ${props[k]}</div>`;
  }

  tooltip.innerHTML = html;
  tooltip.style.left = e.point.x + 15 + 'px';
  tooltip.style.top = e.point.y + 15 + 'px';
  tooltip.style.display = 'block';
}

function onLeave() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// ========================
// 7) Histogramme RÉEL + couleur
// ========================
function updateHistogramReal(variable, breaks, fullColors) {
  if (!statsFeatures || statsFeatures.length === 0) {
    console.warn("❗ Aucune donnée GeoJSON pour le calcul histogramme.");
    return;
  }

  // Extraire les valeurs
  const values = statsFeatures
    .map(f => f.properties[variable])
    .filter(v => v != null);

  // bins (breaks.length+1)
  const binsCount = breaks.length + 1;
  const bins = new Array(binsCount).fill(0);

  values.forEach(val => {
    let binIndex = 0;
    // on parcourt les breaks
    for (let i = 0; i < breaks.length; i++) {
      if (val >= breaks[i]) binIndex = i + 1;
    }
    bins[binIndex]++;
  });

  // Construire labels
  const labels = bins.map((count, i) => {
    if (i === 0) return `< ${breaks[0]}`;
    if (i === breaks.length) return `≥ ${breaks[breaks.length - 1]}`;
    return `${breaks[i - 1]} – ${breaks[i]}`;
  });

  // Couleurs barres = même palette
  const barColors = bins.map((_, i) => fullColors[i]);

  // Mettre à jour Chart.js
  histogram.data.labels = labels;
  histogram.data.datasets[0].data = bins;
  histogram.data.datasets[0].backgroundColor = barColors;
  histogram.update();
}

// ========================
// 8) Légende dynamique
// ========================
function updateLegend(colors, breaks) {
  const legend = document.getElementById('legendChoropleth');
  legend.innerHTML = ''; // vider

  for (let i = 0; i < breaks.length + 1; i++) {
    let label = '';
    if (i === 0) {
      label = `< ${breaks[0]}`;
    } else if (i === breaks.length) {
      label = `≥ ${breaks[breaks.length - 1]}`;
    } else {
      label = `${breaks[i - 1]} – ${breaks[i]}`;
    }

    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.backgroundColor = colors[i];
    item.textContent = label;
    legend.appendChild(item);
  }
}

// ========================
// 9) Variables / Dropdown
// ========================
const variableLabels = {
  revenu_median_menages: "Revenu médian des ménages",
  revenu_median_individus: "Revenu médian des individus",
  taux_chomage: "Taux de chômage (%)",
  taux_diplomes_universitaires: "Diplômés universitaires (%)",
  densite_pop: "Densité de population"
};

// Remplir le dropdown
const dropdown = document.getElementById("variableDropdown");
Object.entries(variableLabels).forEach(([key, label]) => {
  const option = document.createElement("a");
  option.textContent = label;
  option.href = "#";
  option.onclick = (e) => {
    e.preventDefault();
    updateChoropleth(key);
  };
  dropdown.appendChild(option);
});

// ========================
// 10) Interaction sur l’histogramme
//     Click sur une barre => highlight-layer
// ========================
document.getElementById('histogram').onclick = function(evt) {
  const points = histogram.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  if (!points.length) return;

  const barIndex = points[0].index; 
  highlightMapBin(barIndex);
};

// ========================
// 11) highlightMapBin()
// ========================
function highlightMapBin(binIndex) {
  if (!currentVariable || !currentBreaks) return;

  // Récupère min/max
  if (binIndex === 0) {
    // Filtre < breaks[0]
    const maxVal = currentBreaks[0];
    map.setFilter('highlight-layer', [
      '<',
      ['get', currentVariable],
      maxVal
    ]);
  } else if (binIndex === currentBreaks.length) {
    // Filtre ≥ breaks[last]
    const minVal = currentBreaks[currentBreaks.length - 1];
    map.setFilter('highlight-layer', [
      '>=',
      ['get', currentVariable],
      minVal
    ]);
  } else {
    // Filtre [breaks[i-1], breaks[i])
    const minVal = currentBreaks[binIndex - 1];
    const maxVal = currentBreaks[binIndex];
    map.setFilter('highlight-layer', [
      'all',
      ['>=', ['get', currentVariable], minVal],
      ['<',  ['get', currentVariable], maxVal]
    ]);
  }
}
