const express = require('express');
const app = express();

const mongoose = require('mongoose');
//Chemin d'acces
//const path = require('path');

//Importation du router user
const userRoutes = require('./routes/user');

//importation dans app.js pour accéder au path de notre serveur
const path = require('path');

//Importation du modèle "user"
// const userThing = require('./models/user');

//Connexion à MongoDB
mongoose.connect('mongodb+srv://OumarYanni:RN0mDjLHEEWYLpg0@cluster0-piiquante.5cgwwky.mongodb.net/HotTakes?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

// Route Post : Ici, on crée une instance du modèle userThing en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
// app.post('/api/auth/signup', (req, res, next) => {
//   delete req.body._id;
//   const userThing = new userThing({
//     ...req.body
//   });
//   //Ce modèle comporte une méthode save() qui enregistre simplement le Thing dans la base de données.
//   //La méthode save() renvoie une Promise. Ainsi, dans notre bloc then() , nous renverrons une réponse de réussite avec un code 201 de réussite. Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
//   userThing.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//     .catch(error => res.status(400).json({ error }));
// });

// //récupération de la liste de "things" en vente
// app.get('/api/stuff', (req, res, next) => {
//     Thing.find()
//       .then(things => res.status(200).json(things))
//       .catch(error => res.status(400).json({ error }));
//   });

//Importation des routes users et sauces
// app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images.
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;