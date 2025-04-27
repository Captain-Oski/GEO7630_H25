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
        