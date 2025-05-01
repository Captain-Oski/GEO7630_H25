# Lorry et Abdoul

## Application cartographique pour l'accessibilité des aires de stationnement pendant les périodes de déneigement de la ville de Montréal pour la saison 2024-2025.
Durant ce TP, nous avons procedé à l'intégration des données que l'on a eu sur FME, vers le web.
Les étapes par lesquelles nous sommes passés se sont déroulés comme suit.
 ### 1- Mise en place de l'interface et des conteneurs
La première partie de notre TP consistait à faire en sorte que l'on puisse librement développer notre application cartographique dans un environnement facilement déploiable que ce soit durant le développement ou la production.
C'est à dire configuration d'un fichier .env pour que l'on puisse avoir accès à nos bases de données Pg_tile_serv et Pg_feature_serv.

DB_USER=RANL13299903
DB_PASSWORD=RANL13299903
DB_HOST=geo7630h25.cvwywmuc8u6v.us-east-1.rds.amazonaws.com
DB_NAME=geo7630
Le fichier a été crée directement dans le repértoire du Docker que l'on utilise

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/048192c4585a6bc95a4a23adba664eed61d72d04/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20140744.png)

À part cela, nous avons composé le docker pour qu'elle puisse etre utilisable et que nos développements soient directement affichés dans le port 80, port qui fait référence à notre site web permettant de voir l,application cartographique.
Avec cela, le port 8801 et le port 9000 qui abritent nos bases de données postGIS et postgreSQL sont tous aussi déployés dans ce docker
Avec cela, le port 8801 et le port 9000 qui abritent nos bases de données postGIS et postgreSQL sont tous aussi déployés dans ce docker.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/ac23c61cc1e4b94726771094ff54a74fc9990f68/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20141141.png)

Dans Pg_tile_serv, voici les couches sur lesquelles on a travaillé et que l'on compte utiliser pour la conception de notre carte.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/f4914d882a2aa2a97ed2005ba94189de227c486c/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20143008.png)

Voici le site d'accès au port 9000 pour accéder à des données de types WFS, mais que l'on a pas utilisé car on travaille sur des tuiles vectorielles pour ce projet.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/f4914d882a2aa2a97ed2005ba94189de227c486c/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20142844.png)

## 2- Configuration des HTML pour l'interface
Dans ce TP, nous avons deux HTML, le premier au niveau du repértoire app/, et le second directement lié à notre repértoire du TP app/équipes/Équipe2.
Néanmoins, les changements s'opèrent de la meme manière dans deux HTML pour que l'on puisse visualiser les chagngements d'interface et ajouts de boutons.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/1496f28384064677264525242184794325019d26/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20143803.png)

## 3- Configuration des fichier JS nécessaires
Nous avons crée plusieurs fichiers Javascript afin de développer notre application cartographique, à commencer par le script principal, mains que l'on a prénommé app.js qui contient toutes les fonctions et ajouts de couches que l'on a operés.
Elle contient notamment les scripts des couches suivantes :
- Arret-stationnement.js
- hexagon-index.js
- mouse-interactions.js
- nombre de site.js
- stationnement.js
- 2.5D.js
- Bouton-2.5D.js
- layer-handler.js
- buffer.js

## 4- Déscription des fonctionnalités
### - Chargement de la carte
AU chargement de la carte, nous pouvons apercevoir des boutons pour interagir avec les couches, basculer en monde 2D/2.5D pour certaines couches, créer des buffers, et supprimer toutes les couches de la carte.

La couche Places et heures de stationnement est aussi chargée en avance car elle contient le plus d'informations concernant les stationnements et montre le nombre de places directement sur les étiquettes avec aussi, une taille des symboles proportionnelles à ce nombre.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/0ee25be27f43b337ac85381f5ceb11031ac38241/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20114753.png)

### - Description des couches et interactions dynamiques
#### - Stationnements
Directement chargée sur la carte, on peut cliquer sur les couches afin de générer une fentre popup montrant des informations importantes sur les stationnements cliquées, en plus, sur l'interface des couches, une explication sur les légendes apparait directement lorsqu'on clique sur le bouton d'interactions de cette couche.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/d6eb9f7164e41a54abf173eae7d3b4f39674c3df/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20115836.png)

#### - Arrets STM
Appuyer sur le bouton Arrets STM pour les faire apparaitre, les légendes directement chargée en meme temps sur la fenetre faisant apparaitre les couches.
Cliquer sur les points permettra de faire apparaitre aussi des informations concernant ces arrets ( ex : Emplacement du stationnement : Aréna Francis-Bouillon - 3175, rue de Rouen
Nom de l'arrêt : Station Préfontaine - Édicule Hochelaga Nord (B)
Distance : 343.53 m
Type : Station de métro 🚇).

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/59f5ed6cae5c51d5bea7b1ce5463d75560efe8ba/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20120415.png)

#### - Nombre de site
Cette couche montre les répartition des sites de stationnements disponibles durant les périodes de déneigements par arrondissements.
Appuyer sur les couches pourra faire appraitre le nom de l'arrondissement concernés.

Elle est couplée à une fonctionnalité de visualisation en 2.5D et 2D au besoin.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/d0cef44d30ee24e0ebf30513c8df216bdf36117a/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20120811.png)

#### - Densité hexagone
Couche d'index pouvant servir à visualiser la densité des stationnements dans les arrondissements de Montréal, néanmoins, les couleurs ne reflètent pas encore le visuel attendu alors que la légende indique déja les valeurs de densités pour chaque couleur.
Elle est normalement affichée en 2.5D aussi

![Image Alt]()

### - FOnctionnalités adjacentes
#### - Buffer
Nous avons ajouté une fonctionnalité générant des buffers de 100m autour des arrets STM, le bouton créer buffer sert à les faire apparaitre une fois que la couche Arret STM est présente sur la carte.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/7cc8b1ffb979f0ff247f48df6b0dd5c8765ef722/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20121350.png)

#### - 2.5D et Bouton 2.5D
Le 2.5D est le JS utilsé pour animer la couche hexagone index en 2.5D, pour le bouton 2.5D, c,est la fonctionnalité permettant de basculer en 2D ou en 2.5D directement pour la couche Nombre de site uniquement.

Dans cette image par exemple, la couche nombre de site a été basculé en 2D.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/19350c5091d4f20cf809c3449ea1fabbcfc1ec19/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20122137.png)

#### - Mouse interactions
Comme on l'avait vu dans les images précédents, dans ce js, toutes nos codes permettant ces interactions au clic de la souris.

#### - Layer handler
Cette fonctionnalité nous permet en fait de supprimer toutes nos couches qui apparaissent sur la carte à partir du bouton resetMap que l'on a aussi implanté dans nos HTML.

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/42c253cf251043cd66255de9466ec67e75d8a8d8/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20122855.png)

#### - Controles de navigations
Les boutons de controles de navigations ont directement été placé dans le main(app.js)

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/a76ac39e605e34e27b374a789fa2aeb3c6ac363f/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-28%20123026.png)