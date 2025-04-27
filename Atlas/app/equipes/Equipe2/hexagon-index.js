map.on('load', function () {
    map.addSource('RANL13299903.Denssité_hexagon-source', {
        'type': 'vector',
        'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Denssité_hexagon/{z}/{x}/{y}.pbf"]
    
    });
    map.addLayer({
        'id': 'Denssité_hexagon',
        'type': 'fill',
        'source': 'RANL13299903.Denssité_hexagon-source',
        'source-layer': 'RANL13299903.Denssité_hexagon',
        'paint': {
    'fill-color': [
    'step',
    ['get', 'densité_stationnement'], 
    '#ffffcc',    // 0 à 1.6 : Jaune pâle
    1.6, '#ffeda0', // 1.6 à 9.7 : Jaune moyen
    9.7, '#feb24c', // 9.7 à 18.7 : Orange clair
    18.7, '#fd8d3c', // 18.7 à 29.4 : Orange foncé
    29.4, '#f03b20', // 29.4 à 36.1 : Rouge vif
    36.1, '#bd0026'  // >36.1 : Rouge très foncé
],
'fill-opacity': 0.7,
'fill-outline-color': 'gray'
}
    });
});
