const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Connexion à la base de données
const router = express.Router();

// Connexion
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Vérifier si l'utilisateur existe
        const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur introuvable.' });
        }

        const user = rows[0];

        // Comparer le mot de passe
        if (mot_de_passe !== user.mot_de_passe) {
            return res.status(400).json({ error: 'Mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, nom: user.nom }, // Payload
            process.env.JWT_SECRET, // Clé secrète
            { expiresIn: '1h' } // Expiration
        );

        res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (err) {
        console.error('Erreur lors de la tentative de connexion :', err.message);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});

module.exports = router;
