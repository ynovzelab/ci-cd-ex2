# API de Gestion des Feedbacks

Cette API permet de gérer une base de données de feedbacks utilisateurs.

## Prérequis

- Node.js
- MongoDB
- npm ou yarn

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
```
MONGODB_URI=mongodb://localhost:27017/feedback_db
PORT=3000
```

4. Démarrez le serveur :
```bash
npm run dev
```

## Endpoints API

### Importer tous les feedbacks
- POST `/api/feedbacks/bulk`
- Importe automatiquement les données du fichier feedback_500.json

### Ajouter un nouveau feedback
- POST `/api/feedbacks`
- Body:
```json
{
  "id": "fb_xxx",
  "date": "2025-04-14T10:30:00Z",
  "channel": "twitter",
  "text": "Votre feedback ici"
}
```

### Récupérer tous les feedbacks
- GET `/api/feedbacks`
- Retourne la liste complète des feedbacks

## Structure des données

Chaque feedback contient :
- `id` : Identifiant unique
- `date` : Date du feedback
- `channel` : Canal de réception (twitter, facebook, etc.)
- `text` : Contenu du feedback 