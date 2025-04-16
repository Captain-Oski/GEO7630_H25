// chart-init.js

// Déclaration de la variable "histogram" que l'on exporte pour qu'elle soit accessible depuis d'autres modules.
export let histogram;

// Fonction d'initialisation du graphique (histogramme) avec Chart.js
export function initChart() {
  // Définition d'un plugin personnalisé pour Chart.js qui affiche un message lorsqu'il n'y a pas de données
  const noDataPlugin = {
    id: 'noDataMessage', // Identifiant du plugin. On pourra l'activer dans les options du graphique.
    
    // La fonction "afterDraw" est appelée après le dessin du graphique
    afterDraw(chart, args, options) {
      let hasData = false;
      
      // Parcourt chaque dataset du graphique pour vérifier si au moins une valeur différente de 0 ou non nulle est présente
      for (const ds of chart.data.datasets) {
        if (ds.data.some(val => val !== 0 && val != null && val !== undefined)) {
          hasData = true;
          break;
        }
      }
      
      // Si aucune donnée pertinente n'est trouvée, on affiche un message "Aucune donnée"
      if (!hasData) {
        // Récupération du contexte de dessin (canvas), et des dimensions du canvas
        const { ctx, width, height } = chart;
        // On définit le texte, la couleur et la police en se basant sur les options passées ou des valeurs par défaut
        const text = options?.text || "Aucune donnée";
        const color = options?.color || "#666";
        const font = options?.font || "16px sans-serif";
        
        // Sauvegarde l'état du contexte pour rétablir les réglages après dessin
        ctx.save();
        ctx.fillStyle = color;         // Définit la couleur du texte
        ctx.font = font;               // Définit la police et la taille du texte
        ctx.textAlign = 'center';      // Centre horizontalement le texte
        ctx.textBaseline = 'middle';   // Centre verticalement le texte
        
        // Place le texte au centre du canvas
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore(); // Restaure l'état du contexte pour ne pas affecter d'autres dessins
      }
    }
  };

  // Enregistre le plugin personnalisé dans Chart.js pour qu'il soit utilisé dans tous les graphiques
  Chart.register(noDataPlugin);

  // Récupère le contexte 2D du canvas HTML identifié par l'id "histogram"
  const ctx = document.getElementById('histogram').getContext('2d');

  // Création de l'objet Chart (histogramme) avec les paramètres initiaux
  histogram = new Chart(ctx, {
    type: 'bar', // Type de graphique : barres (histogramme)
    data: {
      labels: [],           // Tableau vide pour les étiquettes (labels) de l'axe des x
      datasets: [
        {
          label: 'Distribution',  // Libellé associé aux données du dataset
          data: [],               // Tableau vide pour les données (les comptes des bins)
          backgroundColor: []     // Tableau vide pour la couleur de chaque barre
        }
      ]
    },
    options: {
      responsive: true,  // Le graphique s'adapte à la taille de son conteneur
      scales: {
        x: { display: true },  // Affiche l'axe des x
        y: { display: false }  // Masque l'axe des y (les valeurs sont intégrées par ailleurs)
      },
      plugins: {
        // Désactive la légende qui n'est pas nécessaire pour cet histogramme
        legend: { display: false },
        // Active le plugin "noDataMessage" avec des options personnalisées
        noDataMessage: {
          text: "Aucune donnée disponible", // Message affiché lorsque le graphique ne contient pas de données pertinentes
          color: "#888",                    // Couleur du texte
          font: "16px sans-serif"           // Style de police du texte
        }
      }
    }
  });
}
