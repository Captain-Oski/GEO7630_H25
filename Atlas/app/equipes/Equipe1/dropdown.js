// dropdown.js

// On importe l'objet "variableLabels" depuis le module "variables.js"
// Ce tableau associatif contient les étiquettes pour chaque variable utilisée dans le tooltip et le dropdown.
import { variableLabels } from './variables.js';

// On importe la fonction "updateChoropleth" depuis le module "choropleth.js"
// Cette fonction est appelée lorsqu'une variable est sélectionnée dans le dropdown.
import { updateChoropleth } from './choropleth.js';

/**********************************************************************
 * Fonction initDropdown()
 * - Remplit dynamiquement le menu déroulant avec les options
 *   de variables disponibles.
 * - Pour chaque variable, crée un lien (élément <a>) qui, lorsqu'il est cliqué,
 *   appelera la fonction updateChoropleth() pour mettre à jour la carte.
 **********************************************************************/
export function initDropdown() {
  // Récupère l'élément HTML avec l'id "variableDropdown" qui contiendra le menu déroulant.
  const dropdown = document.getElementById("variableDropdown");
  
  // Pour chaque entrée du tableau "variableLabels" (clé/valeur)
  Object.entries(variableLabels).forEach(([key, label]) => {
    // Crée un élément <a> qui servira d'option dans le dropdown.
    const option = document.createElement("a");
    // Définit le texte de l'option en utilisant le label correspondant.
    option.textContent = label;
    // On rend l'option cliquable en définissant son href sur "#"
    option.href = "#";
    // Ajoute un gestionnaire d'événement "onclick" pour capturer le clic sur l'option
    option.onclick = (e) => {
      e.preventDefault();  // Empêche le comportement par défaut du lien (rechargement de la page)
      // Appelle la fonction updateChoropleth en lui passant la clé de la variable sélectionnée
      updateChoropleth(key);
    };
    // Ajoute l'option créée à l'élément dropdown dans le DOM.
    dropdown.appendChild(option);
  });
}

/**********************************************************************
 * Fonction initHistogramClick()
 * - Attache un événement de clic à l'élément du canvas de l'histogramme.
 * - Lorsqu'une barre de l'histogramme est cliquée, détermine son index et
 *   utilise la fonction highlightMapBin() (importée dynamiquement) pour
 *   mettre en surbrillance les polygones correspondants sur la carte.
 **********************************************************************/
export function initHistogramClick() {
  // Ajoute un gestionnaire d'événement "onclick" à l'élément HTML avec l'id "histogram"
  document.getElementById('histogram').onclick = function(evt) {
    // Utilise l'API de Chart.js pour récupérer les éléments du graphique correspondant
    // au point cliqué (mode "nearest" et avec l'intersection effective).
    const points = histogram.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
    // Si aucun point n'est détecté, on ne fait rien
    if (!points.length) return;
    
    // Récupère l'index de la barre sélectionnée (bin de l'histogramme)
    const barIndex = points[0].index;
    
    // Chargement dynamique du module "choropleth.js" pour appeler la fonction highlightMapBin
    import('./choropleth.js').then(module => {
      // Appelle la fonction highlightMapBin avec l'index de la barre cliquée
      module.highlightMapBin(barIndex);
    });
  };
}
