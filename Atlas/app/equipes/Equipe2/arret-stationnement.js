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
            'circle-radius': 5,
            'circle-color': [
                'step',
                ['get', 'distance'], // <- ici "distance" est le champ dans ta donnée
                'green',  // si distance <= 100
                100, 'blue', // si distance > 100 et <= 300
                300, 'red'   // si distance > 300 et <= 500
                // tout ce qui est > 500m sera rouge aussi sauf si tu veux ajouter une 4e couleur
            ],
            'circle-opacity': 1
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