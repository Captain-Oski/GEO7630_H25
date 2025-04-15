map.on('load', function () {
    // new mapboxglEsriSources.TiledMapService('imagery-source', map, {
    //     url: 'https://tiles.arcgis.com/tiles/133a00biU9FItiqJ/arcgis/rest/services/301_5038_png/MapServer'
    // })

    // map.addLayer({
    //     id: 'imagery-layer',
    //     type: 'raster',
    //     source: 'imagery-source'
    // })
    
    // Exemple Token Privé
    //'https://your-esri-server-url/arcgis/rest/services/your-service/MapServer/tile/{z}/{y}/{x}?token=YOUR_TOKEN'
  
    // map.addSource('test', {
    //     type: 'vector',
    //     url: 'https://vectortileservices6.arcgis.com/133a00biU9FItiqJ/arcgis/rest/services/Analyse_densit_arboricoles_h3/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    //   });

    //   // Ajouter un layer pour afficher les données vectorielles
    //   map.addLayer({
    //     id: 'vector-tile-layer-unstyled',
    //     source: 'test',
    //     paint: {
    //       'fill-color': 'rgba(243,12,76,0.8)',  // Couleur de remplissage
    //       'fill-outline-color': 'white'         // Couleur de bordure
    //     },
    //     'source-layer': 'Analyse_densité_arboricoles_h3',  // Nom du layer dans le service ESRI
    //     type: 'fill'  // Type de layer (polygones ici)
    //   });


    // const wfsUrl = 'https://dservices6.arcgis.com/133a00biU9FItiqJ/arcgis/services/indice_emv_2024_demo/WFSServer?service=wfs&request=getcapabilities';

    // map.addSource('wfs-source', {
    //     type: 'geojson',
    //     data: 'https://dservices6.arcgis.com/133a00biU9FItiqJ/arcgis/services/indice_emv_2024_demo/WFSServer?service=wfs&request=GetFeature&typename=indice_emv_2024_demo:indice_emv_2024_demo_polygons&version=2.0.0&outputFormat=GEOJSON'
    // });

    // map.addLayer({
    //     id: 'wfs-layer',
    //     type: 'fill',
    //     source: 'wfs-source',
    //     paint: {
    //         'fill-color': '#888888',
    //         'fill-opacity': 0.5
    //     }
    // });
});