const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const db = {};

db.sequelize = sequelize;

db.Categorie = require('./categorie')(sequelize, DataTypes);
db.Produit = require('./produit')(sequelize, DataTypes);

// Relations : une Catégorie possède plusieurs Produits (1-N)
db.Categorie.hasMany(db.Produit, { foreignKey: 'categorieId', as: 'produits' });
db.Produit.belongsTo(db.Categorie, { foreignKey: 'categorieId', as: 'categorie' });

module.exports = db;
