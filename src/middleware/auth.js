const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé.' });
    }

    // Vérifie le token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide.' });
        }
        req.user = user; // Ajoute les infos de l'utilisateur à la requête
        next();
    });
};

module.exports = authenticateToken;
