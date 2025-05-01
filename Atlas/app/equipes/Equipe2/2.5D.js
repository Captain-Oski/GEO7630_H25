map.addLayer({
    'id': 'Denssité_hexagon-3d',
    'type': 'fill-extrusion',
    'source': 'RANL13299903.Denssité_hexagon-source',
    'source-layer': 'RANL13299903.Denssité_hexagon',
    'paint': {
        'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'densité_stationnement'],
            0, '#ffffcc',
            5, '#c2e699',
            10, '#78c679',
            20, '#31a354',
            30, '#006837'
        ],
        'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['get', 'densité_stationnement'],
            0, 0,
            5, 500,
            10, 1000,
            20, 2000,
            30, 3000
        ],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.7
    }
});
// Une visualisation en 2.5D mais qui n'est pas visible à cause de la graduation de couleurs qui n'est pas ressortie    