// choropleth.js

// Importation des modules nécessaires pour accéder à la carte, à l'histogramme, et aux variables globales.
import { map } from './map-init.js';
// On importe l'objet histogram et le tableau global "currentBinLabels" à partir de chart-init.js
import { histogram, currentBinLabels } from './chart-init.js';
// On importe les variables globales et constantes définies dans variables.js
import { 
  currentLayerId, currentVariable, currentBreaks, currentFullColors,
  variableSubtitles, variableLabels, statsFeatures
} from './variables.js';

/**********************************************************************
 * Fonction updateChoropleth(variable)
 * - Active ou désactive la visualisation de la variable demandée.
 * - Met à jour la couche choroplèthe sur la carte et l'histogramme.
 **********************************************************************/
export function updateChoropleth(variable) {
  // On récupère l'élément HTML servant à afficher le sous-titre dynamique
  const subtitleElem = document.getElementById('panelVariableSubtitle');

  // --- (A) Gestion de la désactivation ---
  // Si l'utilisateur clique à nouveau sur la même variable alors qu'elle est déjà active
  if (currentVariable === variable) {
    // Vérifie si la couche choroplèthe existe sur la carte
    if (currentLayerId && map.getLayer(currentLayerId)) {
      // Supprime la couche choroplèthe courante
      map.removeLayer(currentLayerId);
      // Supprime la couche de survol (highlight), si elle existe
      if (map.getLayer('highlight-layer')) {
        map.removeLayer('highlight-layer');
      }
      // Retire les événements de survol liés à la couche actuelle
      map.off('mousemove', currentLayerId, onHover);
      map.off('mouseleave', currentLayerId, onLeave);

      // Réinitialise les variables globales associées à la couche courante
      currentLayerId = null;
      currentVariable = null;
      currentBreaks = null;
      currentFullColors = null;
      // Vider le tableau des labels utilisés pour l'histogramme
      while (currentBinLabels.length) { currentBinLabels.pop(); }

      // Réinitialise le contenu de l'histogramme en supprimant étiquettes, données et couleurs
      histogram.data.labels = [];
      histogram.data.datasets[0].data = [];
      histogram.data.datasets[0].backgroundColor = [];
      histogram.update();

      // Vider la légende sur la carte
      document.getElementById('legendChoropleth').innerHTML = '';

      // Met à jour le sous-titre pour inviter l'utilisateur à sélectionner une variable
      if (subtitleElem) {
        subtitleElem.innerText = "Sélectionnez une variable dans le menu";
      }
      return; // Sort de la fonction, car nous avons géré la désactivation
    }
  }

  // Fonction interne pour réinitialiser la carte si nécessaire (non utilisée dans ce cas précis)
  function resetMap() {
    if (currentVariable) {
      updateChoropleth(currentVariable);
    }
  }

  // --- (B) Activation d'une nouvelle variable ---
  // Met à jour la variable active
  currentVariable = variable;
  // On définit la palette de couleurs selon la variable sélectionnée, ou une couleur par défaut si non défini.
  const colors = (import.meta.env && variablePalettes[variable]) || ['#ccc'];

  // Définition manuelle des seuils (breaks) en fonction de la variable sélectionnée
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

  // Construction d'une palette complète qui contient un nombre de couleurs égal à breaks.length+1
  const fullColors = [...colors];
  while (fullColors.length < breaks.length + 1) {
    fullColors.push(colors[colors.length - 1]);
  }

  // On met à jour les variables globales pour la suite
  currentBreaks = breaks;
  currentFullColors = fullColors;

  // Création de l'expression step pour MapLibre :
  // "step" permet de définir des bornes (breaks) pour attribuer différentes couleurs aux classes.
  const stepExpr = ['step', ['get', variable], fullColors[0]];
  for (let i = 0; i < breaks.length; i++) {
    stepExpr.push(breaks[i], fullColors[i + 1]);
  }

  // Suppression de l'ancienne couche si elle existe déjà
  if (currentLayerId && map.getLayer(currentLayerId)) {
    map.removeLayer(currentLayerId);
    if (map.getLayer('highlight-layer')) {
      map.removeLayer('highlight-layer');
    }
    map.off('mousemove', currentLayerId, onHover);
    map.off('mouseleave', currentLayerId, onLeave);
  }

  // Attribution d'un nouvel identifiant à la couche choroplèthe basée sur la variable
  currentLayerId = `recensement-${variable}`;

  // Ajout de la couche choroplèthe à la carte avec le style défini via stepExpr
  map.addLayer({
    id: currentLayerId,
    type: 'fill',
    source: 'recensement2021',
    'source-layer': 'MBAI89260004.Stat_2021_mtl',
    paint: {
      'fill-color': stepExpr,  // Applique la règle de coloration
      'fill-opacity': 0.7,
      'fill-outline-color': '#ccc'
    }
  });

  // Ajout de la couche "highlight" qui sera utilisée pour mettre en évidence une classe lors du survol/clic
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
    // Initialise le filtre à une condition impossible pour ne rien afficher au départ
    filter: ['==', ['get', variable], '___none___']
  });

  // Ajout d'événements de survol pour afficher des informations (tooltip)
  map.on('mousemove', currentLayerId, onHover);
  map.on('mouseleave', currentLayerId, onLeave);

  // Mise à jour de l'histogramme et de la légende associée avec les nouvelles données
  updateHistogramReal(variable, breaks, fullColors);
  updateLegend(fullColors, breaks);

  // Met à jour le sous-titre dans le panneau latéral en fonction de la variable sélectionnée
  if (subtitleElem) {
    subtitleElem.innerText = variableSubtitles[variable] || "Variable non définie";
  }
}

/**********************************************************************
 * Fonction onHover(e)
 * - Affiche un tooltip contenant les propriétés de la feature (polygone)
 *   sur laquelle l'utilisateur survole avec la souris.
 **********************************************************************/
export function onHover(e) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  // Récupère les propriétés de la feature survolée
  const props = e.features[0].properties;
  // Construit le contenu HTML du tooltip en listant toutes les propriétés
  let html = `<strong>${variableLabels[currentVariable] || currentVariable}</strong><br/>`;
  for (const k in props) {
    html += `<div><strong>${k}</strong>: ${props[k]}</div>`;
  }
  tooltip.innerHTML = html;
  // Positionne le tooltip à proximité du curseur
  tooltip.style.left = (e.point.x + 15) + 'px';
  tooltip.style.top = (e.point.y + 15) + 'px';
  tooltip.style.display = 'block';
}

/**********************************************************************
 * Fonction onLeave()
 * - Cache le tooltip quand la souris quitte une feature.
 **********************************************************************/
export function onLeave() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

/**********************************************************************
 * Fonction updateHistogramReal(variable, breaks, fullColors)
 * - Calcule la distribution (bins) des valeurs pour la variable donnée,
 *   et met à jour l'histogramme Chart.js avec les données calculées.
 **********************************************************************/
export function updateHistogramReal(variable, breaks, fullColors) {
  // Vérification de la présence de données statistiques (features GeoJSON)
  if (!statsFeatures || statsFeatures.length === 0) {
    console.warn("❗ Aucune donnée GeoJSON pour le calcul histogramme.");
    return;
  }

  // 1) Extraction des valeurs de la propriété indiquée (variable) pour chaque polygone
  const values = statsFeatures
    .map(f => f.properties[variable])
    .filter(v => v != null);

  // 2) Création d'un tableau de compte initialisé à 0 (nombre de bins = breaks.length + 1)
  const binsCount = breaks.length + 1;
  const bins = new Array(binsCount).fill(0);

  // 3) Pour chaque valeur, détermine l'indice du bin dans lequel elle doit être comptée
  values.forEach(val => {
    let binIndex = 0;
    for (let i = 0; i < breaks.length; i++) {
      if (val >= breaks[i]) binIndex = i + 1;
    }
    bins[binIndex]++;
  });

  // 4) Construction des étiquettes (labels) de l'axe X selon les intervalles définis par breaks
  const labels = bins.map((count, i) => {
    if (i === 0) return `< ${breaks[0]}`;
    if (i === breaks.length) return `≥ ${breaks[breaks.length - 1]}`;
    return `${breaks[i - 1]} – ${breaks[i]}`;
  });

  // 5) Association de couleurs à chaque bin en utilisant la palette complète
  const barColors = bins.map((_, i) => fullColors[i]);

  // 6) Réinitialisation du tableau global des labels (pour le highlight de l'histogramme)
  while (currentBinLabels.length) { currentBinLabels.pop(); }
  labels.forEach(lbl => currentBinLabels.push(lbl));

  // 7) Mise à jour des données de l'histogramme et demande son redessin
  histogram.data.labels = labels;
  histogram.data.datasets[0].data = bins;
  histogram.data.datasets[0].backgroundColor = barColors;
  histogram.update();
}

/**********************************************************************
 * Fonction updateLegend(colors, breaks)
 * - Construit la légende choroplèthe en créant dynamiquement
 *   des éléments HTML affichant les couleurs et intervalles.
 **********************************************************************/
export function updateLegend(colors, breaks) {
  // Récupère l'élément HTML qui contiendra la légende et le vide (innerHTML = '')
  const legend = document.getElementById('legendChoropleth');
  legend.innerHTML = '';

  // Crée et ajoute un titre pour la légende
  const title = document.createElement('div');
  title.id = 'legendChoropleth-title';
  title.textContent = 'Légende choroplèthe';
  legend.appendChild(title);

  // Pour chaque intervalle de breaks, créer une ligne dans la légende
  for (let i = 0; i < breaks.length + 1; i++) {
    let label = '';
    if (i === 0) {
      label = `< ${breaks[0]}`;
    } else if (i === breaks.length) {
      label = `≥ ${breaks[breaks.length - 1]}`;
    } else {
      label = `${breaks[i - 1]} – ${breaks[i]}`;
    }
    // Création des éléments HTML pour chaque ligne de la légende
    const item = document.createElement('div');  // Conteneur d'une ligne de légende
    item.className = 'legend-item';
    const colorBox = document.createElement('div'); // Boîte affichant la couleur
    colorBox.className = 'legend-color-box';
    colorBox.style.backgroundColor = colors[i];
    const labelText = document.createElement('span'); // Texte affichant l'intervalle
    labelText.innerHTML = label;
    // Assemblage : ajoute la boîte couleur et le texte dans le conteneur
    item.appendChild(colorBox);
    item.appendChild(labelText);
    // Ajoute la ligne à l'élément légende
    legend.appendChild(item);
  }
}

/**********************************************************************
 * Fonction highlightMapBin(binIndex)
 * - Met à jour la couche 'highlight-layer' pour filtrer et afficher
 *   uniquement les polygones correspondant à un bin sélectionné (d'après l'histogramme).
 * - Met également à jour le sous-titre pour indiquer la classe sélectionnée.
 **********************************************************************/
export function highlightMapBin(binIndex) {
  // Si aucune variable ou seuil (breaks) n'est défini, on arrête
  if (!currentVariable || !currentBreaks) return;

  // Définition du filtre sur la couche "highlight-layer"
  // Selon l'indice du bin, le filtre est différent :
  // - Pour le premier bin : toutes les valeurs inférieures au premier seuil.
  // - Pour le dernier bin : toutes les valeurs supérieures ou égales au dernier seuil.
  // - Pour les bins intermédiaires : valeurs comprises entre deux seuils.
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

  // Mise à jour du sous-titre pour indiquer la classe de valeur sélectionnée
  const stElem = document.getElementById('panelVariableSubtitle');
  if (stElem && currentBinLabels && currentBinLabels[binIndex]) {
    stElem.innerText = `Classe : ${currentBinLabels[binIndex]}`;
  }
}
