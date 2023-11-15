//Importation de bcrypt pour hasher et crypter les mots de passes
const bcrypt = require("bcrypt");

//Importation jwt pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");

//Demande du modèle "user"
const User = require("../models/user");

//Ajout de la fonction (middleware) sign up pour l'inscription de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  //Dans cette fonction : nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.
  bcrypt
    .hash(req.body.password, 10)
    //Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
    //dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec.
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Ajout de la fonction (middleware) login pour la connexion des utilisateurs existants
exports.login = (req, res, next) => {
  //Dans cette fonction : Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
  User.findOne({ email: req.body.email })
    .then((user) => {
      //Dans le cas contraire, nous renvoyons une erreur401 Unauthorized. Si l'e-mail correspond à un utilisateur existant, nous continuons.
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      //Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          //S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized avec le même message que lorsque l’utilisateur n’a pas été trouvé, afin de ne pas laisser quelqu’un vérifier si une autre personne est inscrite sur notre site.
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          //S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token.
          res.status(200).json({
            userId: user._id,
            //Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
            token: jwt.sign(
              //Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
              { userId: user._id },
              //Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.
              "RANDOM_TOKEN_SECRET",
              //Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
              //Nous renvoyons le token au front-end avec notre réponse.
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
