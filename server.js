require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./models');
const produitRoutes = require('./routes/produit.routes');
const categorieRoutes = require('./routes/categorie.routes');

const app = express();

// ---- Middlewares globaux ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Sert le front-end (public/) ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- Routes de l'API ----
app.use('/api/produits', produitRoutes);
app.use('/api/categories', categorieRoutes);

// Route de test simple de l'API
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API Boutique 🚀' });
});

const PORT = process.env.PORT || 5000;

// ---- Connexion à la base de données puis démarrage du serveur ----
db.sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie.');
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
      console.log(`   Interface web : http://localhost:${PORT}/`);
      console.log(`   API           : http://localhost:${PORT}/api/produits`);
    });
  })
  .catch((err) => {
    console.error('❌ Impossible de se connecter à MySQL.');
    console.error('   Vérifiez que MySQL est démarré, que la base "api_boutique" existe,');
    console.error('   et que le fichier .env contient les bons identifiants.');
    console.error('   Détail de l\'erreur :', err.message);
  });

module.exports = app;
