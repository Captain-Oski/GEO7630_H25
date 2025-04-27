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

![Image Alt](https://github.com/Lorry139/geo7630h25/blob/ac23c61cc1e4b94726771094ff54a74fc9990f68/Images%20TP3/Capture%20d%E2%80%99%C3%A9cran%202025-04-27%20141141.png)

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

![Image Alt]()

