const express = require("express");
const app = express();

const mongoose = require("mongoose");
//Sécurité
//On importe helmet" qui est un module Node.js qui permet de renforcer la sécurité de l'application en définissant différents en-têtes HTTP pour les réponses HTTP.
const helmet = require("helmet");

//Importation de la librairie dotenv et de configurer les variables d'environnement définies dans un fichier .env. Les variables d'environnement sont des informations sensibles telles que les mots de passe, les clés API, etc. qui ne doivent pas être partagées publiquement. La librairie dotenv les charge dans l'environnement Node.js et peut les utiliser dans le code en utilisant process.env.
const dotenv = require("dotenv").config();

//Importation du router user
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//importation dans app.js pour accéder au path de notre serveur
const path = require("path");

//Importation du modèle "user"
// const userThing = require('./models/user');

//Connexion à MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));

// Ajout de la sécurité contre les attaques XSS
app.use(helmet());
// app.use(helmet({
//     // Seules les demandes provenant du même site peuvent lire la ressource
//     // crossOriginResourcePolicy: { policy: "same-site" },
//     })
// );

//Importation des routes user et sauces
// app.use('/api/stuff', stuffRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
