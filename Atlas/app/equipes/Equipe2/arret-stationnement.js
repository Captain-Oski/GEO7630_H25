map.on('load', function () {
 
    map.addSource('RANL13299903.Arret_Stationnement-source', {
        'type': 'vector',
        'tiles': [ "https://silver-spoon-5grrgx7x9qxjhpprj-8801.app.github.dev/RANL13299903.Arret_Stationnement/{z}/{x}/{y}.pbf"]

    });
    map.addLayer({
        'id': 'Arret_Stationnement',
        'type': 'circle',
        'source': 'RANL13299903.Arret_Stationnement-source',
        'source-layer': 'RANL13299903.Arret_Stationnement',

        'paint': {
            'circle-radius': 5, // Rayon du cercle
            'circle-color': 'rgb(10, 67, 80)', // Couleur du cercle
            'circle-opacity': 1 // Opacité du cercle
        }
    });
});

// Ajouter un événement de clic sur le bouton "loadLayer" 
// pour charger la couche de points aléatoires
//document
   // .getElementById('Arret_Stationnement') // j'ai changé, et j'ai mis click et boutton pour essayer d'afficher ma couche, je pense que c'est un problème de source 
   // .addEventListener('click', Arret_Stationnement);
 
    
 
 
   //const Arret_Stationnement = document.querySelector('#Arret_StationnementCheckbox');
 
   //ArretBus.addEventListener('change', (event) => {
       //if(event.target.checked) {
        //generateArret_stationnements()
       //}

       
           //else  {//sinon, retirer-les


               // Supprimer la couche de la carte
              // map.removeLayer('RANL13299903.Arret_Stationnement');
                    //}
                //});