//Importation de Mongoose
const mongoose = require("mongoose");

//Importation du plugin unique validator pour éviter d'avoir plusieurs users avec la même adresse email
//const uniqueValidator = require('mongoose-unique-validator');

//Création d'une constante en utilisant la fonction schéma de mongoose et du schéma de données
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

//Appliquer le plugin unique validator au schéma
//sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sauce", sauceSchema);
