
// Popup pour afficher les informations sur les places disponibles du stationnements, les heures de restrictions et les emplacements
map.on('click', 'Nbres_de_places_et_heures_de_stationnement', (e) => {
    const feature = e.features[0];
// Les informations à afficher sur le popup
    const emplacement = feature.properties.emplacement || 'Emplacement non défini';
    const nombrePlaces = feature.properties.nbr_pla != null ? feature.properties.nbr_pla : 'Nombre inconnu';
    const heures = feature.properties.heures || 'Heures non précisées';
    const note = feature.properties.note_fr || '';

    new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
            <div style="
                background: #ffffff;
                padding: 15px;
                border-radius: 10px;
                font-family: 'Open Sans', sans-serif;
                font-size: 13px;
                color: #333;
                box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                max-width: 250px;
                line-height: 1.5;
            ">
                <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #0078A8;">
                    Informations sur le stationnement
                </h4>
                <p style="margin: 0;"><strong>📍 Emplacement :</strong><br> ${emplacement}</p>
                <p style="margin: 0;"><strong>🚗 Nombre de places :</strong> ${nombrePlaces}</p>
                <p style="margin: 0;"><strong>⏰ Heures de restriction :</strong><br> ${heures}</p>
                ${note ? `<p style="margin: 0;"><strong>📝 Note :</strong><br> ${note}</p>` : ''}
            </div>
        `)
        .addTo(map);

    map.flyTo({ center: feature.geometry.coordinates, zoom: 14 });
});


// Popup pour afficher les informations concernant l'arret se trouvant autour de la zone de stationnement ( distance/au stationnement, nom de l'arret, Emplacement, type d'arret )
map.on('click', 'Arret_Stationnement', (e) => {
    const feature = e.features[0];
// Les informations à afficher sur le popup
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
// Popup pour la couche nombre de site
map.on('click', 'Nbre_de_site', (e) => {
    const feature = e.features[0];
// Les informations à afficher sur le popup
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