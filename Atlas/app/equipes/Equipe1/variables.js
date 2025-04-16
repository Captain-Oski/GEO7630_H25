// variables.js

/**********************************************************************
 * Variables globales et constantes utilisées dans l'application
 * Ces variables servent à stocker l'état de la couche active,
 * les données chargées et les paramètres de style (palettes, labels)
 **********************************************************************/

// Identifiants de la couche choroplèthe active sur la carte.
// Ces variables permettent de stocker les références actuelles pour pouvoir
// les modifier, les supprimer ou les réinitialiser lorsqu'une nouvelle variable est sélectionnée.
export let currentLayerId = null;
export let currentVariable = null;

// Seuils et palettes en cours d'utilisation pour la coloration dynamique des couches.
// "currentBreaks" contiendra les valeurs seuil définies pour la variable, et
// "currentFullColors" sera la palette complétée en fonction du nombre de seuils.
export let currentBreaks = null;
export let currentFullColors = null;

// Variable permettant de contrôler la visibilité de la couche des arrondissements.
// Cette variable est utilisée pour basculer l'affichage des arrondissements (visible/masqué).
export let arrondissementLayerVisible = true;

// Données brutes sous forme de GeoJSON utilisées pour le calcul de l'histogramme.
// Ces données contiennent toutes les features (polygones) dont les statistiques
// sont exploitées pour construire l'histogramme.
export let statsFeatures = [];

// Étiquettes utilisées pour l'histogramme lors du survol (highlight).
// Ce tableau est mis à jour lors du calcul de l'histogramme et sert par la suite
// à afficher les classes correspondantes aux bins.
export let currentBinLabels = [];

/**********************************************************************
 * Définition des palettes de couleurs pour chaque variable.
 * Chaque variable dispose d'une palette de couleurs spécifiques allant du clair vers le foncé.
 **********************************************************************/
export const variablePalettes = {
  revenu_median_menages: [
    '#f7fcf0', '#e5f5f9', '#ccece6', '#99d8c9',
    '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'
  ],
  revenu_median_individus: [
    '#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda',
    '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'
  ],
  taux_chomage: [
    '#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7',
    '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'
  ],
  taux_diplomes_universitaires: [
    '#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84',
    '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'
  ],
  densite_pop: [
    '#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb',
    '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'
  ]
};

/**********************************************************************
 * Libellés à afficher dans le tooltip et dans le menu déroulant
 * pour chaque variable.
 * Ces labels permettent de formuler des titres ou des descriptions
 * plus lisibles pour l'utilisateur.
 **********************************************************************/
export const variableLabels = {
  revenu_median_menages: "Revenu médian des ménages",
  revenu_median_individus: "Revenu médian des individus",
  taux_chomage: "Taux de chômage (%)",
  taux_diplomes_universitaires: "Diplômés universitaires (%)",
  densite_pop: "Densité de population"
};

/**********************************************************************
 * Optionnel : Sous-titres dynamiques pour le panneau latéral de l'application.
 * Ces sous-titres fournissent un complément d'information sur la variable sélectionnée.
 **********************************************************************/
export const variableSubtitles = {
  revenu_median_menages: "Sous-titre pour le revenu des ménages",
  revenu_median_individus: "Sous-titre pour le revenu des individus",
  taux_chomage: "Sous-titre pour le taux de chômage",
  taux_diplomes_universitaires: "Sous-titre pour le taux de diplômés universitaires",
  densite_pop: "Sous-titre pour la densité de population"
};
