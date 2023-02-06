//Importation de express pour le router
const express = require('express');

//Création du router avec la fonction router d'express
const router = express.Router();

//Middleware d'authentification des routes
const auth = require('../middleware/auth');

//Multer pour les fichiers images
const multer = require('../middleware/multer-config');

//Controller pour associer les fonctions aux différentes routes
const sauceCtrl = require('../controllers/sauce');

//Création des routes CRUD
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likesManagement);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);

//Exportation du routeur pour pouvoir l'importer dans app.js
module.exports = router;