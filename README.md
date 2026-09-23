# My_Weekly_Taskflow

## Présentation

**TaskFlow** est une application web permettant d'organiser et de gérer ses tâches hebdomadaires. Ce projet personnel met en pratique le développement frontend et backend, ainsi que la communication avec une base de données MySQL. Il s'agit d'un projet conçu pour démontrer des compétences en développement web dans un portfolio de développeuse web junior.

## Objectifs du projet

- Organiser les tâches sur une vue hebdomadaire.
- Créer, modifier et supprimer des tâches.
- Gérer le statut et la priorité des tâches.
- Naviguer entre les semaines.
- Proposer une interface responsive et intuitive.
- Mettre en place un backend pour gérer les données.
- Utiliser une base de données MySQL pour le stockage des données.

## Fonctionnalités

- Création, modification et suppression de tâches.
- Affichage des tâches par jour.
- Navigation entre les semaines.
- Gestion des statuts et des priorités des tâches.
- Indication des tâches terminées.
- Responsive design.
- Communication avec une API backend.

## Technologies utilisées

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MySQL
- Sequelize
- dotenv
- CORS

### Outils

- Git
- GitHub
- VS Code

## Architecture du projet

Le projet est structuré en trois parties principales :
1. **Frontend** : Interface utilisateur et interactions.
2. **Backend** : API REST et logique serveur.
3. **MySQL** : Stockage des données.

## Arborescence du projet

```plaintext
taskflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.js
│   └── public/
│       └── Page accueil application.png
│   └── package.json
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   └── package.json
└── README.md
```

## Prérequis

- Node.js
- npm
- MySQL

## Installation

1. Clonez le repository GitHub :
   ```bash
   git clone https://github.com/Fabo1235/My_Weekly_Taskflow.git
   cd taskflow
   ```

2. Installez les dépendances pour le frontend :
   ```bash
   cd frontend
   npm install
   ```

3. Installez les dépendances pour le backend :
   ```bash
   cd ../backend
   npm install
   ```

## Configuration MySQL

Créez une base de données MySQL et configurez les variables d'environnement dans un fichier `.env` situé dans le dossier 

backend

 :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your

_password


DB_NAME=taskflow_db
```

Remplacez `your_password` par votre mot de passe MySQL.

## Lancement du projet

### Lancer le frontend

1. Naviguez dans le dossier 

frontend

 :
   ```bash
   cd frontend
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

3. Accédez à l'application à l'adresse [http://localhost:5173](http://localhost:5173).

### Lancer le backend

1. Naviguez dans le dossier 

backend

 :
   ```bash
   cd backend
   ```

2. Lancez le serveur backend :
   ```bash
   npm start
   ```

3. Le backend sera accessible à l'adresse [http://localhost:5000](http://localhost:5000).

## API REST

| Méthode | Route            | Description                  |
| ------- | ---------------- | ---------------------------- |
| GET     | `/api/tasks`      | Récupère toutes les tâches.  |
| POST    | `/api/tasks`      | Ajoute une nouvelle tâche.   |
| PUT     | `/api/tasks/:id`  | Modifie une tâche existante. |
| DELETE  | `/api/tasks/:id`  | Supprime une tâche par ID.   |

## Base de données

La base de données MySQL est utilisée pour stocker les informations sur les tâches. Les modèles sont définis avec Sequelize pour faciliter les interactions avec la base de données.

### Modèles principaux

- **Task** : Représente une tâche avec des champs tels que `title`, `description`, `status`, `priority`, et `due_date`.

## Explications techniques

- **Séparation frontend/backend** : Le projet est structuré pour séparer clairement les responsabilités entre le frontend (interface utilisateur) et le backend (logique serveur et gestion des données).
- **Communication avec l'API** : Le frontend communique avec le backend via des requêtes HTTP pour récupérer et manipuler les données.
- **Utilisation de React** : Permet de créer une interface utilisateur dynamique et réactive.
- **Utilisation de Tailwind CSS** : Facilite le développement d'un design moderne et responsive.
- **Utilisation de MySQL** : Fournit un stockage fiable et structuré pour les données des tâches.

## Captures d'écran

### Page d'accueil de l'application

![Page d'accueil](frontend/public/Page%20accueil%20application.png)

## Améliorations futures

- Ajouter des notifications pour rappeler les tâches importantes.
- Implémenter des filtres avancés pour organiser les tâches par priorité ou statut.
- Ajouter des tests unitaires et d'intégration pour garantir la fiabilité du code.
- Améliorer l'expérience utilisateur avec des animations et des transitions.
- Déployer l'application en production.

## Auteur

- **Nom** : Fanny BOIREAU
- **GitHub** : [Fabo1235](https://github.com/Fabo1235)

---
