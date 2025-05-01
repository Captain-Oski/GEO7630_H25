// Cette fonction supprime toutes les couches et sources de la carte
 
// Ajouter ici tous les identifiants unique (id) de layers (ceux de map.AddLayers())
 
var myLayers = ['Denssité_hexagon-3d','Nbre_de_site','Denssité_hexagon','Arret_Stationnement', 'Nbre_de_site-3d','buffer-arret-layer','Nbres_de_places_et_heures_de_stationnement','Nbre_de_site-label','Nbres_de_places_et_heures_de_stationnement-label']
 
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
 // Cliquer sur le bouton restMap pour supprimer toutes les couches
document
    .getElementById('resetMap')
    .addEventListener('click', removeAllLayersAndSources);