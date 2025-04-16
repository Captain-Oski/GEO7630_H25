// main.js

// Importation des fonctions d'initialisation des différents modules de l'application.
import { initMap } from './map-init.js';               // Initialise la carte MapLibre et ses contrôles.
import { initChart } from './chart-init.js';             // Configure et crée le graphique (histogramme) avec Chart.js.
import { loadData } from './data-loader.js';             // Charge les sources de données (GeoJSON, MVT) et configure les couches associées.
import { initDropdown, initHistogramClick } from './dropdown.js'; // Prépare le menu déroulant et les interactions avec l'histogramme.

// L'événement 'DOMContentLoaded' garantit que le code s'exécute 
// lorsque le DOM est entièrement chargé et prêt à être manipulé.
document.addEventListener('DOMContentLoaded', () => {
  // Initialise la carte avec son style, ses contrôles, et la configuration de Split.js.
  initMap();
  
  // Configure et crée l'histogramme, y compris le plugin personnalisé pour afficher un message quand il n'y a pas de données.
  initChart();
  
  // Lance le chargement de toutes les sources de données nécessaires à l'application :
  // - GeoJSON pour les arrondissements
  // - Tuiles vectorielles (MVT) pour les statistiques du recensement.
  loadData();
  
  // Initialise le menu déroulant avec les variables disponibles pour la visualisation.
  initDropdown();
  
  // Configure l'interaction sur l'histogramme pour permettre de sélectionner une classe (bin) en cliquant dessus.
  initHistogramClick();
});
