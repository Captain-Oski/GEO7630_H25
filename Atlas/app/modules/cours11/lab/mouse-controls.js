//  Événement au survol de la couche "commerces" : on change le curseur de la souris
map.on('mouseenter', 'commerces', () => {
    // Change le curseur en pointeur (main) pour indiquer que l'élément est interactif
    map.getCanvas().style.cursor = 'pointer';
});

//  Quand la souris quitte la couche "commerces" : on remet le curseur par défaut
map.on('mouseleave', 'commerces', () => {
    map.getCanvas().style.cursor = '';
});

//  Événement au clic sur un commerce
map.on('click', 'commerces', (e) => {
    // On récupère la première entité (feature) cliquée
    const feature = e.features[0];

    // Extraction des coordonnées du point (on fait une copie avec slice())
    const coordinates = feature.geometry.coordinates.slice();

    // Récupération de propriétés pour alimenter la popup
    const name = feature.properties.name;
    const description = feature.properties.type;

    // 📍 Création et affichage d'une popup HTML à la position cliquée
    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>${name}</strong><br>${description}`)
        .addTo(map);

    // Zoom et centrage automatique vers le point sélectionné
    map.flyTo({ center: coordinates, zoom: 14 }); // JumpTo
});