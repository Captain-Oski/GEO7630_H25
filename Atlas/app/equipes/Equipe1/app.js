/**********************************************
 * Application Webmapping Interactif
 * 1) Carte MapLibre + Panel latéral
 * 2) Données MVT + GeoJSON (statsFeatures)
 * 3) Choroplèthe (colors + breaks)
 * 4) Histogramme Chart.js (bins)
 * 5) Survol (tooltip) + highlight
 * 6) Sous-titre dynamique (variable + bin)
 **********************************************/

/**********************************************
 * Variables et structures globales
 **********************************************/
// Identifiants de couche courante
let currentLayerId = null;
let currentVariable = null;

// Seuils et palettes en cours
let currentBreaks = null;
let currentFullColors = null;

// Contrôle d'affichage arrondissements
let arrondissementLayerVisible = true;

// Données brutes (GeoJSON) pour calcul histogramme
let statsFeatures = [];

// Étiquettes d'histogramme pour le highlight
let currentBinLabels = [];

// Carte MapLibre (instance globale)
let map;

// ===============
// 1) Initialisation de la Carte
// ===============
map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
  center: [-73.68, 45.55],
  zoom: 9,
  hash: true
});

// Contrôles (zoom, geolocate, scale)
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

// Split.js pour séparer la carte et le panneau
Split(['#map', '#infoPanel'], {
  sizes: [66, 34],
  minSize: [300, 300],
  gutterSize: 8,
  snapOffset: 0
});






// ===============
// 2) Plugin Chart.js "No Data"
//    => Affiche un texte s'il n'y a pas de données
// ===============
const noDataPlugin = {
  id: 'noDataMessage',
  afterDraw(chart, args, options) {
    let hasData = false;
    for (const ds of chart.data.datasets) {
      if (ds.data.some(val => val !== 0 && val != null && val !== undefined)) {
        hasData = true;
        break;
      }
    }
    if (!hasData) {
      const { ctx, width, height } = chart;
      const text = options?.text || "Aucune donnée";
      const color = options?.color || "#666";
      const font = options?.font || "16px sans-serif";
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
      ctx.restore();
    }
  }
};
Chart.register(noDataPlugin);



// ===============
// 3) Histogramme Chart.js
// ===============
// Ici on fait la même chose que d'habitude, 
// sauf qu'on rajoute "noDataMessage" dans plugins
const ctx = document.getElementById('histogram').getContext('2d');
const histogram = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Distribution',
        data: [],
        backgroundColor: []
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
      legend: { display: false },
      noDataMessage: {
        text: "Aucune donnée disponible", // texte par défaut
        color: "#888",
        font: "16px sans-serif"
      }
    }
  }
});




// ===============
// 3) Événements "map.on('load')"
// ===============
// Au chargement de la carte, on prépare nos sources, etc.
map.on('load', () => {
  // A) Charger GeoJSON des arrondissements
  fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.arrondissements/items?limit=10000')
    .then(res => res.json())
    .then(data => {
      // Source 'arrondissements'
      map.addSource('arrondissements', { type: 'geojson', data });

      // Couche fill
      map.addLayer({
        id: 'arrondissements-fill',
        type: 'fill',
        source: 'arrondissements',
        paint: {
          'fill-color': '#cccccc',
          'fill-opacity': 0.4
        },
        layout: { visibility: 'visible' }
      });

      // Couche line
      map.addLayer({
        id: 'arrondissements-line',
        type: 'line',
        source: 'arrondissements',
        paint: {
          'line-color': '#4e5e7e',
          'line-width': 2,
          'line-dasharray': [2, 2]
        },
        layout: { visibility: 'visible' }
      });
      

      // Bouton pour afficher / masquer arrondissements
      document
        .getElementById('toggleArrondissement')
        .addEventListener('click', () => {
          arrondissementLayerVisible = !arrondissementLayerVisible;
          const visibility = arrondissementLayerVisible ? 'visible' : 'none';
          map.setLayoutProperty('arrondissements-fill', 'visibility', visibility);
          map.setLayoutProperty('arrondissements-line', 'visibility', visibility);
        });
    });

    
    

  // B) Source MVT pour la carte
  map.addSource('recensement2021', {
    type: 'vector',
    tiles: [
      'https://literate-telegram-x57676p4rjrfvw6p-8801.app.github.dev/MBAI89260004.Stat_2021_mtl/{z}/{x}/{y}.pbf'
    ],
    minzoom: 0,
    maxzoom: 14
  });

  // C) Charger toutes les features en GeoJSON pour construire l'histogramme
  fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.Stat_2021_mtl/items?limit=10000')
    .then(r => r.json())
    .then(fullData => {
      statsFeatures = fullData.features;
      console.log('✅ Stat_2021_mtl (GeoJSON) chargé :', statsFeatures.length, 'features');
    });
});

// ===============
// 4) Palette de couleurs par variable
// ===============
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

// ===============
// 5) updateChoropleth(variable)
//    => Active ou désactive la variable
//    => Construit la couche choroplèthe + histogram
// ===============
function updateChoropleth(variable) {
  // Référence au sous-titre dynamique
  const subtitleElem = document.getElementById('panelVariableSubtitle');

  // (A) Désactivation si on reclique sur la même variable
  if (currentVariable === variable) {
    if (currentLayerId && map.getLayer(currentLayerId)) {
      // Supprimer la couche + layer highlight
      map.removeLayer(currentLayerId);
      if (map.getLayer('highlight-layer')) {
        map.removeLayer('highlight-layer');
      }

      // Retirer events
      map.off('mousemove', currentLayerId, onHover);
      map.off('mouseleave', currentLayerId, onLeave);

      // Reset variables
      currentLayerId = null;
      currentVariable = null;
      currentBreaks = null;
      currentFullColors = null;
      currentBinLabels = [];

      // Vider histogramme
      histogram.data.labels = [];
      histogram.data.datasets[0].data = [];
      histogram.data.datasets[0].backgroundColor = [];
      histogram.update();

      // Vider légende
      document.getElementById('legendChoropleth').innerHTML = '';

      // Sous-titre par défaut
      if (currentVariable === variable) {
        // ... on supprime la couche, highlight, etc.
      
        // On vide l’histogramme
        histogram.data.labels = [];
        histogram.data.datasets[0].data = [];
        histogram.data.datasets[0].backgroundColor = [];
        histogram.update();
      
        // On vide la légende
        document.getElementById('legendChoropleth').innerHTML = '';
      
        // Sous-titre => "Sélectionnez une variable dans le menu"
        if (subtitleElem) {
          subtitleElem.innerText = "Sélectionnez une variable dans le menu";
        }
        return;
      }
      
      // (B) Nouvelle variable
      currentVariable = variable;
      // ...
      if (subtitleElem) {
        subtitleElem.innerText = variableSubtitles[variable] || "Variable non définie";
      }
      
      return;
    }
  }


  function resetMap() {
    // Si on a une variable active, c’est comme si on recliquait dessus
    if (currentVariable) {
      updateChoropleth(currentVariable);
    }
  }
  

  // (B) Nouvelle variable sélectionnée
  currentVariable = variable;

  // Palette
  const colors = variablePalettes[variable] || ['#ccc'];

  // Définir manuellement les seuils (breaks)
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

  // Équilibrer la palette (on veut breaks.length+1 couleurs)
  const fullColors = [...colors];
  while (fullColors.length < breaks.length + 1) {
    fullColors.push(colors[colors.length - 1]);
  }

  currentBreaks = breaks;
  currentFullColors = fullColors;

  // Expression step
  const stepExpr = ['step', ['get', variable], fullColors[0]];
  for (let i = 0; i < breaks.length; i++) {
    stepExpr.push(breaks[i], fullColors[i + 1]);
  }

  // Supprimer l'ancienne couche (si existe)
  if (currentLayerId && map.getLayer(currentLayerId)) {
    map.removeLayer(currentLayerId);
    if (map.getLayer('highlight-layer')) {
      map.removeLayer('highlight-layer');
    }
    map.off('mousemove', currentLayerId, onHover);
    map.off('mouseleave', currentLayerId, onLeave);
  }

  // ID de la nouvelle couche
  currentLayerId = `recensement-${variable}`;

  // Ajouter la couche choroplèthe
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

  // Couche highlight (vide pour commencer)
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
    filter: ['==', ['get', variable], '___none___'] // Aucun polygone sélectionné
  });

  // Événements de survol
  map.on('mousemove', currentLayerId, onHover);
  map.on('mouseleave', currentLayerId, onLeave);

  // Mettre à jour l’histogramme + légende
  updateHistogramReal(variable, breaks, fullColors);
  updateLegend(fullColors, breaks);

  // (Re)définir le sous-titre final (après avoir choisi la variable)
  if (subtitleElem) {
    // Si tu as un objet "variableSubtitles" pour un label + sous-titre, tu peux l'utiliser ici
    subtitleElem.innerText = variableSubtitles[variable] || "Variable non définie";
  }
}

// ===============
// 6) Survol : tooltip
// ===============
function onHover(e) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;

  // Récupérer les propriétés de la zone survolée
  const props = e.features[0].properties;

  let html = `<strong>${variableLabels[currentVariable] || currentVariable}</strong><br/>`;
  for (const k in props) {
    html += `<div><strong>${k}</strong>: ${props[k]}</div>`;
  }

  tooltip.innerHTML = html;
  tooltip.style.left = (e.point.x + 15) + 'px';
  tooltip.style.top = (e.point.y + 15) + 'px';
  tooltip.style.display = 'block';
}

function onLeave() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// ===============
// 7) updateHistogramReal(...)
//    => Calcule la distribution réelle (bins)
//    => Met à jour Chart.js
// ===============
function updateHistogramReal(variable, breaks, fullColors) {
  if (!statsFeatures || statsFeatures.length === 0) {
    console.warn("❗ Aucune donnée GeoJSON pour le calcul histogramme.");
    return;
  }

  // 1) Extraire la valeur pour chaque polygone
  const values = statsFeatures
    .map(f => f.properties[variable])
    .filter(v => v != null);

  // 2) Préparer le tableau de compte (binsCount = breaks + 1)
  const binsCount = breaks.length + 1;
  const bins = new Array(binsCount).fill(0);

  // 3) Pour chaque valeur, trouver son binIndex
  values.forEach(val => {
    let binIndex = 0;
    for (let i = 0; i < breaks.length; i++) {
      if (val >= breaks[i]) binIndex = i + 1;
    }
    bins[binIndex]++;
  });

  // 4) Construire les labels d'axe X
  const labels = bins.map((count, i) => {
    if (i === 0) return `< ${breaks[0]}`;
    if (i === breaks.length) return `≥ ${breaks[breaks.length - 1]}`;
    return `${breaks[i - 1]} – ${breaks[i]}`;
  });

  // 5) Couleurs correspondantes à chaque bin
  const barColors = bins.map((_, i) => fullColors[i]);

  // 6) Stocker globalement pour highlightMapBin
  currentBinLabels = labels;

  // 7) Mise à jour Chart.js
  histogram.data.labels = labels;
  histogram.data.datasets[0].data = bins;
  histogram.data.datasets[0].backgroundColor = barColors;
  histogram.update();
}

// ===============
// 8) updateLegend(...)
//    => Construit la légende choroplèthe
// ===============
function updateLegend(colors, breaks) {
  const legend = document.getElementById('legendChoropleth');
  legend.innerHTML = ''; // on vide la légende

  // Titre en haut de la légende
  const title = document.createElement('div');
  title.id = 'legendChoropleth-title';
  title.textContent = 'Légende choroplèthe';
  legend.appendChild(title);

  // Boucle sur chaque classe de "breaks"
  for (let i = 0; i < breaks.length + 1; i++) {
    let label = '';
    if (i === 0) {
      label = `< ${breaks[0]}`;
    } else if (i === breaks.length) {
      label = `≥ ${breaks[breaks.length - 1]}`;
    } else {
      label = `${breaks[i - 1]} – ${breaks[i]}`;
    }

    // Ligne de la légende
    const item = document.createElement('div');
    item.className = 'legend-item';

    // Boîte de couleur
    const colorBox = document.createElement('div');
    colorBox.className = 'legend-color-box';
    colorBox.style.backgroundColor = colors[i];

    // Texte de la classe
    const labelText = document.createElement('span');
    labelText.innerHTML = label;

    // Assemblage
    item.appendChild(colorBox);
    item.appendChild(labelText);
    legend.appendChild(item);
  }
}


// ===============
// 9) variableLabels
//    => Donne un libellé pour le tooltip
// ===============
const variableLabels = {
  revenu_median_menages: "Revenu médian des ménages",
  revenu_median_individus: "Revenu médian des individus",
  taux_chomage: "Taux de chômage (%)",
  taux_diplomes_universitaires: "Diplômés universitaires (%)",
  densite_pop: "Densité de population"
};

// ===============
// 10) Remplir le dropdown
// ===============
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

// ===============
// 11) Interaction sur l’histogramme
//    => Click sur une barre => highlight-layer
// ===============
document.getElementById('histogram').onclick = function(evt) {
  const points = histogram.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  if (!points.length) return;

  const barIndex = points[0].index;
  highlightMapBin(barIndex);
};

// ===============
// 12) highlightMapBin(barIndex)
//    => Filtre la couche 'highlight-layer' pour n'afficher que ce bin
// ===============
function highlightMapBin(binIndex) {
  if (!currentVariable || !currentBreaks) return;

  // 1) Détermine l'intervalle min/max
  if (binIndex === 0) {
    const maxVal = currentBreaks[0];
    map.setFilter('highlight-layer', [
      '<',
      ['get', currentVariable],
      maxVal
    ]);
  } else if (binIndex === currentBreaks.length) {
    const minVal = currentBreaks[currentBreaks.length - 1];
    map.setFilter('highlight-layer', [
      '>=',
      ['get', currentVariable],
      minVal
    ]);
  } else {
    const minVal = currentBreaks[binIndex - 1];
    const maxVal = currentBreaks[binIndex];
    map.setFilter('highlight-layer', [
      'all',
      ['>=', ['get', currentVariable], minVal],
      ['<',  ['get', currentVariable], maxVal]
    ]);
  }

  // 2) Mettre à jour le sous-titre ou un label
  const stElem = document.getElementById('panelVariableSubtitle');
  if (stElem && currentBinLabels && currentBinLabels[binIndex]) {
    stElem.innerText = `Classe : ${currentBinLabels[binIndex]}`;
  }
}
