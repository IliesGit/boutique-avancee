const db = require('../models');
const Categorie = db.Categorie;
const Produit = db.Produit;

// CREATE — POST /api/categories
exports.create = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ message: 'Le nom de la catégorie est obligatoire.' });
    }

    const categorie = await Categorie.create({ nom });
    res.status(201).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie.', error: error.message });
  }
};

// READ ALL — GET /api/categories
exports.findAll = async (req, res) => {
  try {
    const categories = await Categorie.findAll({ order: [['nom', 'ASC']] });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories.', error: error.message });
  }
};

// READ ONE — GET /api/categories/:id
exports.findOne = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [{ model: Produit, as: 'produits' }],
    });
    if (!categorie) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// UPDATE — PUT /api/categories/:id
exports.update = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }
    await categorie.update({ nom: req.body.nom });
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.', error: error.message });
  }
};

// DELETE — DELETE /api/categories/:id
exports.delete = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }
    await categorie.destroy();
    res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression.', error: error.message });
  }
};
