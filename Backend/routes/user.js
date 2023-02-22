//Importation de express pour le router
const express = require("express");

//Création du router avec la fonction router d'express
const router = express.Router();

//Controller pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

//Middleware
const validatePassword = require("../middleware/passwordValidator");

//Création de deux routes
router.post("/signup", validatePassword, userCtrl.signup);
router.post("/login", userCtrl.login);

//Exportation du routeur pour pouvoir l'importer dans app.js
module.exports = router;
