const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); // Import de la connexion à la base de données

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware pour parser le JSON

// Import des routes utilisateurs
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Import des routes produits
const productRoutes = require('./routes/products');
app.use('/api/produits', productRoutes);

// Import du middleware pour l'authentification
const authenticateToken = require('./middleware/auth');

// Route protégée pour récupérer les produits par utilisateur
app.get('/api/user-products', authenticateToken, (req, res) => {
    const userId = req.user.id; // Récupère l'ID de l'utilisateur connecté depuis le token

    console.log(`ID de l'utilisateur connecté: ${userId}`); // Log pour vérification

    // Requête SQL pour récupérer les produits de cet utilisateur
    const sql = 'SELECT * FROM produits WHERE utilisateur_id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
        }
        console.log(`Produits récupérés pour l'utilisateur ${userId}:`, results); // Log des produits récupérés
        res.json(results);
    });
});

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route introuvable' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
