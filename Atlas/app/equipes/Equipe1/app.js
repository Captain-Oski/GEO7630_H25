document.addEventListener('DOMContentLoaded', () => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.70, 45.59],
    zoom: 19,
    hash: true
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
});
