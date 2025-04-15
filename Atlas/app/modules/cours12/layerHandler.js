// Cette fonction supprime toutes les couches et sources de la carte
function removeAllLayersAndSources() {
    var allSources = map.getStyle().sources;
    console.log(allSources)
    // Supprimer chaque couche
    myLayers.forEach(function (layerName) {
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
        }
    })

    // Supprimer chaque source
    myLayers.forEach(function (layerName) {
        if (allSources.hasOwnProperty(`${layerName}-source`)) {
            map.removeSource(`${layerName}-source`);
        }
    });
}

document
    .getElementById('resetMap')
    .addEventListener('click', removeAllLayersAndSources);
