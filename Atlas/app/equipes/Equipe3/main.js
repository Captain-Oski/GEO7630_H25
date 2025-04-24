document.addEventListener('DOMContentLoaded', function () {
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
        center: [-73.55, 45.55],
        zoom: 9,
        hash: true
    });

    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    const scale = new maplibregl.ScaleControl({ unit: 'metric' });
    map.addControl(scale);

    const inondationdropdown = document.getElementById('inondation-dropdown');
    setTimeout(() => {
        inondationdropdown.disabled = false;
    }, 1000);

    const arrondissementsSourceUrl = 'https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson';
    const collisionurl = 'https://donnees.montreal.ca/fr/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/3957364a-f579-4bc4-987a-299708fefd3e/download/collisions_routieres.geojson';

    let collisionsData = null; // on garde les données en mémoire ici

    map.on('load', async function () {
        map.addSource('arrondissementsSource', {
            type: 'geojson',
            data: arrondissementsSourceUrl
        });

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
       
        // Charger les collisions une seule fois
        const response = await fetch(collisionurl);
        collisionsData = await response.json();

        map.addSource('collisionsSource', {
            type: 'geojson',
            data: collisionsData
        });

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

    document.getElementById('neighborhoods').addEventListener('change', function (e) {
        const visibility = e.target.checked ? 'visible' : 'none';
        map.setLayoutProperty('arrondissements', 'visibility', visibility);
        map.setLayoutProperty('arrondissements-labels', 'visibility', visibility);
    });

    // Calcul des statistiques une fois que les données sont en mémoire
    inondationdropdown.addEventListener('change', function (e) {
        const selectedValue = e.target.value.trim();
    
        if (!collisionsData) {
            console.warn('Les données ne sont pas encore chargées.');
            return;
        }
    
        if (!selectedValue) {
            map.setFilter('collisions', null);
            updateStats(0, 0);
            return;
        }
    
        map.setFilter('collisions', ['==', ['get', 'GRAVITE'], selectedValue]);
    
        let nbAccidents = 0;
        let nbMorts = 0;
    
        collisionsData.features.forEach(f => {
            const p = f.properties;
            if (p.GRAVITE && p.GRAVITE.trim() === selectedValue) {
                nbAccidents++;
                nbMorts += parseInt(p.NB_MORTS) || 0; // On additionne uniquement les morts
            }
        });
    
        updateStats(nbAccidents, nbMorts);
    });
    
    function updateStats(accidents, morts) {
        console.log("Mise à jour des stats :", { accidents, morts });
        document.getElementById('nb_accidents').textContent = `Nombre d'accidents : ${accidents}`;
        document.getElementById('nb_morts').textContent = `Nombre de morts : ${morts}`;
    }

// 1. Curseur pointeur au survol des collisions
    map.on('mouseenter', 'collisions', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'collisions', () => {
        map.getCanvas().style.cursor = '';
    });

// 2. Compteur des collisions visibles à l'écran
    function mettreAJourCompteur() {
        const compteurElement = document.getElementById('compteur');
        if (!compteurElement) return;

    // Vérification de la couche "collisions"
    const features = map.queryRenderedFeatures({ layers: ['collisions'] });
    compteurElement.innerText = `Collisions visibles : ${features.length}`;
    }

// 3. Filtrage des collisions par gravité via le dropdown
    const filtreTypeElement = document.getElementById('inondation-dropdown');
        if (filtreTypeElement) {
        filtreTypeElement.addEventListener('change', function (){
        const type = filtreTypeElement.value.trim();

        if (type === 'Tous') {
            map.setFilter('collisions', null);
        } else {
            // Vérification du champ 'GRAVITE'
            map.setFilter('collisions', ['==', ['get', 'GRAVITE'], type]
                
            );
        }

        mettreAJourCompteur();
    });
}

// 4. Mise à jour du compteur après navigation
    map.on('moveend', mettreAJourCompteur);

// 5. Popup au clic sur une collision
    map.on('click', 'collisions', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    // Vérification des propriétés avant d'afficher la popup
    new maplibregl.Popup()
        .setLngLat(coords)
        .setHTML(`
            <strong>Gravité :</strong> ${props.GRAVITE || 'Non spécifiée'}<br>
            <strong>Nombre de morts :</strong> ${props.NB_MORTS || 0} 
        `)
        .addTo(map);
});

    
});
