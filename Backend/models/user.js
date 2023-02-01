//Importation de Mongoose
const mongoose = require('mongoose');

//Importation du plugin unique validator pour éviter d'avoir plusieurs users avec la même adresse email
const uniqueValidator = require('mongoose-unique-validator');

//Création d'une constante en utilisant la fonction schéma de mongoose et du schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Appliquer le plugin unique validator au schéma 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);