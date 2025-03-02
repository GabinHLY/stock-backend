const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db'); // Connexion à la base de données

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Token manquant.' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide.' });
    }
};

// Route pour récupérer les produits d'un utilisateur
router.get('/', authenticateToken, async (req, res) => {
    try {
        const utilisateurId = req.user.id;

        const [rows] = await db.query('SELECT * FROM produits WHERE utilisateur_id = ?', [utilisateurId]);

        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// Route pour ajouter un produit
router.post('/', authenticateToken, async (req, res) => {
    try {
        const utilisateurId = req.user.id;
        const { nom, stock, prix_achat, etat, prix_vente } = req.body;

        if (!nom || stock === undefined || prix_achat === undefined || !etat) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        // Vérifiez si prix_vente est requis
        if (etat === 'vendu' && (prix_vente === undefined || prix_vente === '')) {
            return res.status(400).json({ error: 'Le prix de vente est requis pour un produit vendu.' });
        }

        const [result] = await db.query(
            'INSERT INTO produits (nom, stock, prix_achat, etat, prix_vente, utilisateur_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, stock, prix_achat, etat, etat === 'vendu' ? prix_vente : null, utilisateurId]
        );

        res.status(201).json({ message: 'Produit ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});


// Route pour mettre à jour un produit
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const utilisateurId = req.user.id;
        const { nom, stock, prix_achat, etat, prix_vente } = req.body;

        if (!nom || stock === undefined || prix_achat === undefined || !etat) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        // Vérifiez si prix_vente est requis
        if (etat === 'vendu' && (prix_vente === undefined || prix_vente === '')) {
            return res.status(400).json({ error: 'Le prix de vente est requis pour un produit vendu.' });
        }

        const [produit] = await db.query(
            'SELECT * FROM produits WHERE id = ? AND utilisateur_id = ?',
            [req.params.id, utilisateurId]
        );

        if (!produit.length) {
            return res.status(404).json({ error: 'Produit non trouvé ou non autorisé.' });
        }

        await db.query(
            'UPDATE produits SET nom = ?, stock = ?, prix_achat = ?, etat = ?, prix_vente = ? WHERE id = ?',
            [nom, stock, prix_achat, etat, etat === 'vendu' ? prix_vente : null, req.params.id]
        );

        res.json({ message: 'Produit mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du produit :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});


// Route pour supprimer un produit
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const utilisateurId = req.user.id;

        const [produit] = await db.query(
            'SELECT * FROM produits WHERE id = ? AND utilisateur_id = ?',
            [req.params.id, utilisateurId]
        );

        if (!produit.length) {
            return res.status(404).json({ error: 'Produit non trouvé ou non autorisé.' });
        }

        await db.query('DELETE FROM produits WHERE id = ?', [req.params.id]);

        res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du produit :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

module.exports = router;
