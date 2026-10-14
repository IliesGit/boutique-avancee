const db = require('../models');
const Produit = db.Produit;
const Categorie = db.Categorie;

// CREATE — POST /api/produits
exports.create = async (req, res) => {
  try {
    const { nom, description, prix, stock, categorieId } = req.body;

    if (!nom || prix === undefined || prix === null) {
      return res.status(400).json({ message: 'Le nom et le prix sont obligatoires.' });
    }
    if (Number(prix) < 0) {
      return res.status(400).json({ message: 'Le prix ne peut pas être négatif.' });
    }

    const produit = await Produit.create({
      nom,
      description,
      prix,
      stock: stock ?? 0,
      categorieId: categorieId || null,
    });

    const produitAvecCategorie = await Produit.findByPk(produit.id, {
      include: [{ model: Categorie, as: 'categorie' }],
    });

    res.status(201).json(produitAvecCategorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du produit.', error: error.message });
  }
};

// READ ALL — GET /api/produits
exports.findAll = async (req, res) => {
  try {
    const { categorieId } = req.query;
    const where = categorieId ? { categorieId } : {};

    const produits = await Produit.findAll({
      where,
      include: [{ model: Categorie, as: 'categorie' }],
      order: [['id', 'ASC']],
    });

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits.', error: error.message });
  }
};

// READ ONE — GET /api/produits/:id
exports.findOne = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id, {
      include: [{ model: Categorie, as: 'categorie' }],
    });

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// UPDATE — PUT /api/produits/:id
exports.update = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    const { nom, description, prix, stock, categorieId } = req.body;

    if (prix !== undefined && Number(prix) < 0) {
      return res.status(400).json({ message: 'Le prix ne peut pas être négatif.' });
    }

    await produit.update({ nom, description, prix, stock, categorieId });

    const produitMisAJour = await Produit.findByPk(produit.id, {
      include: [{ model: Categorie, as: 'categorie' }],
    });

    res.status(200).json(produitMisAJour);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.', error: error.message });
  }
};

// DELETE — DELETE /api/produits/:id
exports.delete = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    await produit.destroy();
    res.status(200).json({ message: 'Produit supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit.', error: error.message });
  }
};
