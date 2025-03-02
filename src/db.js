require('dotenv').config();
const mysql = require('mysql2/promise'); // Utilisation de mysql2/promise pour gérer les promesses

// Création d'une connexion poolée avec mysql2/promise
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => {
    console.log('Connecté à la base de données MySQL');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MySQL :', err.message);
  });

module.exports = db;
