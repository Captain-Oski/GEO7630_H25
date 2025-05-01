// Popup pour afficher les informations sur les places disponibles du stationnements, les heures de restrictions et les emplacements
map.on('click', 'Nbres_de_places_et_heures_de_stationnement', (e) => {
    const feature = e.features[0];

    const emplacement = feature.properties.emplacement || 'Emplacement non défini';
    const nombrePlaces = feature.properties.nbr_pla != null ? feature.properties.nbr_pla : 'Nombre inconnu';
    const heures = feature.properties.heures || 'Heures non précisées';
    const note = feature.properties.note_fr || '';

    new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
            <strong>Emplacement :</strong> ${emplacement}<br>
            <strong>Nombre de places :</strong> ${nombrePlaces}<br>
            <strong>Heures :</strong> ${heures}<br>
            <strong>Note :</strong> ${note}
        `)
        .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});
// Popup pour afficher les informations concernant l'arret se trouvant autour de la zone de stationnement ( distance/au stationnement, nom de l'arret, Emplacement, type d'arret )
map.on('click', 'Arret_Stationnement', (e) => {
    const feature = e.features[0];

    const emplacement = feature.properties.emplacement_stationnement || 'Emplacement non disponible';
    const nom_arret = feature.properties.nom_arret || 'Nom non disponible';
    const distance = feature.properties.distance_m_ != null ? feature.properties.distance_m_.toFixed(2) + ' m' : 'Distance inconnue';
    
    const type_transport = feature.properties['type_de_transport__0=bus_2=métro_'];
    
    // Définir le texte et la couleur selon le type de transport
    let typeText = 'Type inconnu';
    let popupColor = 'white'; // couleur par défaut

    if (type_transport === 0) {
        typeText = 'Arrêt de bus 🚌';
        popupColor = '#fff8b0'; // jaune pâle
    } else if (type_transport === 2) {
        typeText = 'Station de métro 🚇';
        popupColor = '#b0e0ff'; // bleu clair
    }

    new maplibregl.Popup({ 
        closeButton: true,
        closeOnClick: true,
    })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`
        <div class="popup-content" style="
            background-color: ${popupColor};
            padding: 10px;
            border-radius: 8px;
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: black;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
            <strong>Emplacement du stationnement :</strong> ${emplacement}<br>
            <strong>Nom de l'arrêt :</strong> ${nom_arret}<br>
            <strong>Distance :</strong> ${distance}<br>
            <strong>Type :</strong> ${typeText}
        </div>
    `)
    .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});

map.on('click', 'Nbre_de_site', (e) => {
    const feature = e.features[0];

    const nom = feature.properties.nom || 'Nom non disponible';
    const nbre_sites = feature.properties.nbre_site_stationnement != null ? feature.properties.nbre_site_stationnement : 'Non précisé';

    const coordinates = e.lngLat;

    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
            <div style="background:white; padding:10px; border-radius:6px; box-shadow:0 0 5px rgba(0,0,0,0.3); font-family:'Open Sans', sans-serif; font-size:13px;">
                <strong>Arrondissement :</strong> ${nom}<br>
                <strong>Nombre de sites de stationnement :</strong> ${nbre_sites}
            </div>
        `)
        .addTo(map);

    map.flyTo({ center: coordinates, zoom: 12 });
});