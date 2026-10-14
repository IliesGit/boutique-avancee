const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produit.controller');

router.get('/', produitController.findAll);
router.get('/:id', produitController.findOne);
router.post('/', produitController.create);
router.put('/:id', produitController.update);
router.delete('/:id', produitController.delete);

module.exports = router;
