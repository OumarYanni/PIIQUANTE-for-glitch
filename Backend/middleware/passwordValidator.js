//La constante passwordValidator est une instance du package express-validator qui est un middleware pour la validation de données dans Express.js. Il vérifie si les données envoyées dans une requête HTTP sont valides selon les règles de validation spécifiées. Par exemple, si une validation de mots de passe est requise, passwordValidator pourrait être utilisé pour vérifier si le mot de passe respecte les critères tels que la longueur minimale, la présence de caractères spéciaux, etc. Cela aide à garantir la sécurité des données en s'assurant que les entrées utilisateur sont valides avant de les traiter sur le serveur.
const passwordValidator = require("password-validator");

//Création d'un schéma pour la validation du mot de passe
const schema = new passwordValidator();

//Définition des règles pour la validation du mot de passe
schema
  .is()
  .min(8) // Longueur minimale du mot de passe
  .is()
  .max(100) // Longueur maximale du mot de passe
  .has()
  .uppercase() // Au moins une majuscule
  .has()
  .lowercase() // Au moins une minuscule
  .has()
  .digits() // Au moins un chiffre
  .has()
  .symbols() // Au moins un symbole
  .has()
  .not()
  .spaces(); // Pas d'espace

//Middleware pour la validation du mot de passe
module.exports = (req, res, next) => {
  const { password } = req.body;

  if (!schema.validate(password)) {
    return res.status(400).json({ error: "Mot de passe non valide" });
  }
  next();
};
