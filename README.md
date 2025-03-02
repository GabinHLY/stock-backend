# Projet Backend - Achat-Revente

## Description
Ce projet est une application backend pour une plateforme qui aide à gérer les stocks (notament d'un magasin).

## Fonctionnalités
- Authentification et autorisation des utilisateurs
- Gestion des produits (opérations CRUD)

## Technologies Utilisées
- Node.js
- Express.js
- MySQL
- JWT pour l'authentification

## Installation
1. Cloner le dépôt :
    ```bash
    git clone https://github.com/GabinHLY/stock-backend.git
    ```
2. Aller dans le répertoire du projet :
    ```bash
    cd achat-revente-backend
    ```
3. Installer les dépendances :
    ```bash
    npm install
    ```

## Utilisation
1. Démarrer le serveur :
    ```bash
    npm start
    ```
2. Le serveur sera accessible à `http://localhost:3000`.

## Points de terminaison de l'API
- `POST /api/auth/register` - Enregistrer un nouvel utilisateur
- `POST /api/auth/login` - Connecter un utilisateur
- `GET /api/products` - Obtenir tous les produits
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `POST /api/transactions` - Créer une nouvelle transaction

## Contribuer
Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request.

## Licence
Ce projet est sous licence MIT.