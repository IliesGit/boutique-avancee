const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');

router.get('/', categorieController.findAll);
router.get('/:id', categorieController.findOne);
router.post('/', categorieController.create);
router.put('/:id', categorieController.update);
router.delete('/:id', categorieController.delete);

module.exports = router;
