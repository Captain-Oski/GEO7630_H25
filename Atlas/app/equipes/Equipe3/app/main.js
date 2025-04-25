// Attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {

    // Création de la carte avec Maplibre GL
    const map = new maplibregl.Map({
        container: 'map', // ID de l'élément HTML contenant la carte
        style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj', // Style de carte
        center: [-73.55, 45.55], // Centre initial (Montréal)
        zoom: 9, // Niveau de zoom initial
        hash: true // Met à jour l'URL avec les coordonnées et le zoom
    });

    // Ajout des contrôles de navigation (zoom, rotation)
    map.addControl(new maplibregl.NavigationControl());

    // Ajout du contrôle d'attribution avec affichage compact
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    // Ajout d'une échelle métrique à la carte
    const scale = new maplibregl.ScaleControl({ unit: 'metric' });
    map.addControl(scale);

    // Référence à la liste déroulante des inondations
    const inondationdropdown = document.getElementById('inondation-dropdown');

    // Active la liste déroulante après 1 seconde
    setTimeout(() => {
        inondationdropdown.disabled = false;
    }, 1000);

    // URL des données GeoJSON des arrondissements
    const arrondissementsSourceUrl = 'https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson';

    // URL des données GeoJSON des collisions routières
    const collisionurl = 'https://donnees.montreal.ca/fr/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/3957364a-f579-4bc4-987a-299708fefd3e/download/collisions_routieres.geojson';

    // Variable pour stocker les données de collisions
    let collisionsData = null;

    // Événement déclenché lorsque la carte est chargée
    map.on('load', async function () {

        // Ajoute la source GeoJSON des arrondissements
        map.addSource('arrondissementsSource', {
            type: 'geojson',
            data: arrondissementsSourceUrl
        });

        // Ajoute une couche de remplissage pour les arrondissements
        map.addLayer({
            id: 'arrondissements',
            type: 'fill',
            source: 'arrondissementsSource',
            paint: {
                'fill-color': '#ccc',
                'fill-opacity': 0.5,
                'fill-outline-color': '#000'
            }
        });

        // Ajoute une couche d’étiquettes pour afficher les noms d’arrondissements
        map.addLayer({
            id: 'arrondissements-labels',
            type: 'symbol',
            source: 'arrondissementsSource',
            layout: {
                'text-field': ['get', 'NOM'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 14,
                'text-anchor': 'center'
            },
            paint: {
                'text-color': '#111',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        });

        // Charge les données de collisions
        const response = await fetch(collisionurl);
        collisionsData = await response.json();

        // Ajoute la source des collisions à la carte
        map.addSource('collisionsSource', {
            type: 'geojson',
            data: collisionsData
        });

        // Ajoute une couche de points pour les collisions avec couleurs selon la gravité
        map.addLayer({
            id: 'collisions',
            type: 'circle',
            source: 'collisionsSource',
            paint: {
                'circle-color': [
                    'match',
                    ['get', 'GRAVITE'],
                    'Dommages matériels inférieurs au seuil de rapportage', 'orange',
                    'Dommages matériels seulement', 'yellow',
                    'Grave', 'blue',
                    'Léger', 'green',
                    'Mortel', 'purple',
                    'grey'
                ],
                'circle-stroke-color': '#fff',
                'circle-stroke-width': 1
            }
        });
    });

    // Gère le clic sur les éléments de la légende pour filtrer les collisions selon la gravité
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', function () {
            const gravite = this.getAttribute('data-gravite');
            if (gravite === 'Tous') {
                map.setFilter('collisions', null);
            } else {
                map.setFilter('collisions', ['==', ['get', 'GRAVITE'], gravite]);
            }
        });
    });

    // Affiche ou masque les arrondissements selon l'état de la case à cocher
    document.getElementById('neighborhoods').addEventListener('change', function (e) {
        const visibility = e.target.checked ? 'visible' : 'none';
        map.setLayoutProperty('arrondissements', 'visibility', visibility);
        map.setLayoutProperty('arrondissements-labels', 'visibility', visibility);
    });

    // Gestion du changement dans la liste déroulante des inondations
    inondationdropdown.addEventListener('change', function (e) {
        const selectedValue = e.target.value.trim();

        // Si les données ne sont pas chargées, avertit et sort
        if (!collisionsData) {
            console.warn('Les données ne sont pas encore chargées.');
            return;
        }

        // Si "Tous" est sélectionné, supprime les filtres et remet les stats à zéro
        if (!selectedValue || selectedValue === 'Tous') {
            map.setFilter('collisions', null);
            updateStats(0, 0);
        } else {
            // Filtre les collisions selon la gravité sélectionnée
            map.setFilter('collisions', ['==', ['get', 'GRAVITE'], selectedValue]);

            let nbAccidents = 0;
            let nbMorts = 0;

            // Calcule le nombre d'accidents et de morts
            collisionsData.features.forEach(f => {
                const p = f.properties;
                if (p.GRAVITE && p.GRAVITE.trim() === selectedValue) {
                    nbAccidents++;
                    nbMorts += parseInt(p.NB_MORTS) || 0;
                }
            });

            // Met à jour les statistiques affichées
            updateStats(nbAccidents, nbMorts);
        }

        // Met à jour le compteur de collisions visibles
        mettreAJourCompteur();
    });

    // Met à jour le texte contenant les statistiques d'accidents et morts
    function updateStats(accidents, morts) {
        console.log("Mise à jour des stats :", { accidents, morts });
        document.getElementById('nb_accidents').textContent = `Nombre d'accidents : ${accidents}`;
        document.getElementById('nb_morts').textContent = `Nombre de morts : ${morts}`;
    }

    // Change le curseur en pointeur au survol des collisions
    map.on('mouseenter', 'collisions', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'collisions', () => {
        map.getCanvas().style.cursor = '';
    });

    // Fonction qui met à jour le compteur des collisions actuellement visibles
    function mettreAJourCompteur() {
        const compteurElement = document.getElementById('compteur');
        if (!compteurElement) return;

        const features = map.queryRenderedFeatures({ layers: ['collisions'] });
        compteurElement.innerText = `Collisions visibles : ${features.length}`;
    }

    // Met à jour le compteur lorsque la carte a fini de se déplacer
    map.on('moveend', mettreAJourCompteur);

    // Affiche une popup avec détails au clic sur une collision
    map.on('click', 'collisions', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties;
        const coords = feature.geometry.coordinates;

        new maplibregl.Popup()
            .setLngLat(coords)
            .setHTML(`
                <strong>Gravité :</strong> ${props.GRAVITE || 'Non spécifiée'}<br>
                <strong>Nombre de morts :</strong> ${props.NB_MORTS || 0} 
            `)
            .addTo(map);
    });
});
