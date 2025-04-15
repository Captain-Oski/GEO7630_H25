# 📚 GEO 7630 - Semaine 13 : Mise en production & 3D Tiles

## 🗓️ Date
- **9 avril 2025**

## 🎯 Objectifs du cours 13
1. Comprendre les **principes de mise en production** d’une application de webmapping.
2. Explorer les **bonnes pratiques de diffusion et d’assurance qualité** pour le développement applicatif.
3. Introduire les concepts de **contribution open source**.
4. Se familiariser avec les **formats 3D Tiles** pour la visualisation 3D web.
5. Se préparer à l’**examen final**.

---

## 📋 Contenu du cours

### **1. Mise en production d’une application de webmapping**
- **Cycles de développement** :
  - Modèle en cascade vs méthode agile.
  - Itérations, feedbacks, tests continus.
- **Cycle de vie applicatif** :
  - Conception → Développement → Déploiement → Maintenance → Retrait.
- **Bonnes pratiques de diffusion** :
  - Déploiement progressif, parallèle ou par lots.
  - Tests d’intégration, de charge et de non-régression.
  - Monitoring avec outils comme Grafana.

#### **Assurance qualité et open source**
- **Revue de code** et respect des normes (accessibilité, sécurité).
- **Contribution open source** :
  - Utilisation de forks, pull requests, licences (MIT, GPL…).
  - Participation communautaire (doc, tests, support).

---

### **2. Visualisation 3D avec 3D Tiles**
#### **Technologies explorées**
- **3D Tiles & glTF** :
  - Format de tuiles optimisé pour la visualisation 3D web.
  - Utilisation dans la planification urbaine, modélisation de terrain, circulation, etc.
- **Photorealistic 3D Tiles (PR3DT)** :
  - Intégration de textures réalistes pour un rendu immersif.
- **Itowns** :
  - Plateforme open source (INRIA) basée sur WebGL, Three.js, OpenLayers.
  - Support de CityGML, GeoJSON, LiDAR…
- **Three.js** :
  - Librairie JS pour la visualisation 3D interactive.
- **Exemples** :
  - Sea level rise map : [🔗 démo](https://nagix.github.io/sea-level-rise-3d-map/#/-74.0026669/40.7086314/15.89/-81.52/60)
  - Deck.gl avec 3D Tiles : [🔗 Google Examples](https://developers.google.com/maps/documentation/tile/3d-tiles)

---

## 🧪 Laboratoire
### **Thème : Mise en production & 3D Tiles**
1. **Manipuler et intégrer des 3D Tiles** :
   - Visualisation avec Itowns, intégration dans un viewer personnalisé.
2. **Bonnes pratiques DevOps** :
   - Publier une application cartographique sur GitHub.
   - Gérer les forks, commits, pull requests.
3. **Publication web** :
   - Configuration DNS, nom de domaine, hébergement statique.
   - Utilisation de GitHub Pages et NGINX conteneurisé.

---

## 📂 Ressources et liens utiles
- **Itowns** : [Documentation](https://www.itowns-project.org/)
- **Cesium - 3D Tiles Next** : [Article](https://cesium.com/blog/2021/11/10/introducing-3d-tiles-next/)
- **glTF** : [Khronos glTF](https://www.khronos.org/gltf/)
- **Three.js** : [Documentation officielle](https://threejs.org/)
- **Deck.gl 3D Tiles** : [Google Example](https://developers.google.com/maps/documentation/tile/3d-tiles)
- **Docker** : [Documentation Docker](https://docs.docker.com/)
- **Grafana** : [Grafana Playground](https://play.grafana.org/d/000000012/grafana-play-home?orgId=1)

---

## 📝 Devoir
- **Préparation finale TP3** : Finaliser la mise en production de votre application de webmapping.
- **Travail à effectuer** :
  - Intégrer des **composants 3D** (Itowns, Tiles).
  - **Publier** l’application via **GitHub** et soumettre une **pull request**.
- **Date de remise TP3** : **16 avril 2025**.

---

## ❓ Questions et échanges
- Revue des choix d’architecture et des défis rencontrés.
- Retour sur les étapes de diffusion et publication web.
- Discussion ouverte en vue de l’**examen final**.

---

**🚀 À la semaine prochaine pour le cours 14 et l'examen final !**
