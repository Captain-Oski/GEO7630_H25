// map-init.js

// On importe le module Split pour pouvoir diviser l'interface en sections (ici, la carte et le panneau d'information).
// Assure-toi que Split.js est bien chargé (soit via une importation, soit via une inclusion dans le HTML).
import Split from 'split.js';

// On exporte la variable "map" pour qu'elle soit accessible depuis d'autres modules.
export let map;

/**********************************************************************
 * Fonction initMap()
 * - Initialise la carte MapLibre avec un style, un centre, un niveau de zoom, etc.
 * - Ajoute divers contrôles (navigation, géolocalisation, échelle) à la carte.
 * - Utilise Split.js pour séparer l'affichage de la carte et du panneau latéral.
 **********************************************************************/
export function initMap() {
  // Création de l'instance de la carte avec les paramètres de base.
  map = new maplibregl.Map({
    container: 'map',  // L'ID de l'élément HTML qui contiendra la carte.
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',  // URL du style MapLibre (ici, fourni par MapTiler).
    center: [-73.68, 45.55],  // Coordonnées géographiques du centre de la carte [longitude, latitude].
    zoom: 9,  // Niveau de zoom initial.
    hash: true  // Active l'utilisation du hash dans l'URL pour refléter l'état de la carte (zoom, centre, etc.).
  });

  // ---------------------------------------------------------------
  // Ajout de contrôles à la carte
  // ---------------------------------------------------------------

  // Contrôle de navigation (boutons de zoom et boussole pour l'orientation).
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

  // Contrôle de géolocalisation pour permettre à l'utilisateur de centrer la carte sur sa position.
  // Les options définissent l'activation de la haute précision et l'affichage de la direction.
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,   // Suivi continu de la position de l'utilisateur.
      showUserHeading: true      // Affiche la direction dans laquelle l'utilisateur est orienté.
    }),
    'top-left'
  );

  // Contrôle d'échelle pour afficher une échelle cartographique.
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

  // ---------------------------------------------------------------
  // Utilisation de Split.js pour diviser l'interface en deux sections :
  // - La première pour la carte (#map)
  // - La seconde pour le panneau latéral (#infoPanel)
  // ---------------------------------------------------------------
  Split(['#map', '#infoPanel'], {
    sizes: [66, 34],   // Répartition initiale des tailles en pourcentage (66% pour la carte, 34% pour le panneau).
    minSize: [300, 300],  // Taille minimale en pixels pour chaque section.
    gutterSize: 8,     // Taille de la barre de séparation (gutter).
    snapOffset: 0      // Décalage de claquage pour l'ajustement automatique des sections.
  });
}
