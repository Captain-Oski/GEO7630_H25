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

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

