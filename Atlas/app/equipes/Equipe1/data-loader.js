// data-loader.js

// Importation de la carte depuis le module "map-init.js"
import { map } from './map-init.js';
// Importation de la variable globale "statsFeatures" depuis le module "variables.js"
// Cette variable contiendra les données GeoJSON utilisées pour l'histogramme.
import { statsFeatures } from './variables.js';

/**********************************************************************
 * Fonction loadData()
 * - Charge les différentes sources de données (GeoJSON et MVT)
 * - Configure la couche d'arrondissements et la source pour les statistiques
 **********************************************************************/
export function loadData() {
  // Attache un événement "load" à la carte qui s'exécutera une fois que la carte est initialisée
  map.on('load', () => {
    // -------------------------------------------------------------
    // A) Charger le GeoJSON des arrondissements
    // -------------------------------------------------------------
    fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.arrondissements/items?limit=10000')
      // Conversion de la réponse en JSON
      .then(res => res.json())
      .then(data => {
        // Ajoute la source "arrondissements" à la carte en utilisant les données GeoJSON récupérées
        map.addSource('arrondissements', { type: 'geojson', data });

        // -------------------------------------------------------------
        // Couche de remplissage (fill) pour les arrondissements
        // -------------------------------------------------------------
        map.addLayer({
          id: 'arrondissements-fill',     // Identifiant de la couche de remplissage
          type: 'fill',                   // Type de couche : remplissage
          source: 'arrondissements',      // Utilise la source GeoJSON "arrondissements"
          paint: {
            'fill-color': '#cccccc',      // Couleur de remplissage (gris clair)
            'fill-opacity': 0.4           // Opacité du remplissage
          },
          layout: { visibility: 'visible' }  // La couche est visible par défaut
        });

        // -------------------------------------------------------------
        // Couche de contour (line) pour les arrondissements
        // -------------------------------------------------------------
        map.addLayer({
          id: 'arrondissements-line',     // Identifiant de la couche de contours
          type: 'line',                   // Type de couche : ligne
          source: 'arrondissements',      // Utilise la même source GeoJSON
          paint: {
            'line-color': '#4e5e7e',       // Couleur de la ligne (gris bleuté)
            'line-width': 2,               // Épaisseur de la ligne
            'line-dasharray': [2, 2]       // Motif en tirets pour la ligne
          },
          layout: { visibility: 'visible' }  // La couche est visible par défaut
        });

        // -------------------------------------------------------------
        // Bouton de bascule pour afficher/masquer les arrondissements
        // -------------------------------------------------------------
        document
          .getElementById('toggleArrondissement')    // Récupère l'élément HTML (bouton) avec l'id "toggleArrondissement"
          .addEventListener('click', () => {
            // Utilisation d'une importation dynamique pour accéder au module "variables.js"
            // afin de basculer l'état de la variable "arrondissementLayerVisible".
            import('./variables.js').then(module => {
              // Bascule l'état : true devient false, false devient true.
              module.arrondissementLayerVisible = !module.arrondissementLayerVisible;
              // Détermine la visibilité en fonction de l'état de la variable
              const visibility = module.arrondissementLayerVisible ? 'visible' : 'none';
              // Applique la visibilité sur la couche de remplissage
              map.setLayoutProperty('arrondissements-fill', 'visibility', visibility);
              // Applique également sur la couche de contours
              map.setLayoutProperty('arrondissements-line', 'visibility', visibility);
            });
          });
      });

    // -------------------------------------------------------------
    // B) Définir la source MVT pour la carte
    // -------------------------------------------------------------
    // Ajoute une source de tuiles vectorielles pour les statistiques du recensement (Stat_2021_mtl)
    map.addSource('recensement2021', {
      type: 'vector', // Type de source : vector tiles
      tiles: [
        'https://literate-telegram-x57676p4rjrfvw6p-8801.app.github.dev/MBAI89260004.Stat_2021_mtl/{z}/{x}/{y}.pbf'
      ],
      minzoom: 0,     // Zoom minimum où les tuiles sont disponibles
      maxzoom: 14     // Zoom maximum
    });

    // -------------------------------------------------------------
    // C) Charger toutes les features en GeoJSON pour construire l'histogramme
    // -------------------------------------------------------------
    fetch('https://literate-telegram-x57676p4rjrfvw6p-9000.app.github.dev/collections/MBAI89260004.Stat_2021_mtl/items?limit=10000')
      .then(r => r.json())
      .then(fullData => {
        // Utilisation d'une importation dynamique pour affecter la variable "statsFeatures"
        // Depuis le module "variables.js"
        import('./variables.js').then(module => {
          // Affecte les features GeoJSON récupérées à la variable globale "statsFeatures"
          module.statsFeatures = fullData.features;
          // Affiche dans la console le nombre de features chargées pour vérification
          console.log('✅ Stat_2021_mtl (GeoJSON) chargé :', module.statsFeatures.length, 'features');
        });
      });
  });
}
