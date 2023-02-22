//Demande du modèle "sauce"
const Sauce = require("../models/sauce");

// On importe filesystem pour la gestion des fichiers
const fs = require("fs");

// Ce code représente un contrôleur pour la création d'une sauce
// Il est exporté pour être utilisé dans un autre module
exports.createSauce = (req, res, next) => {
  // Conversion du corps de la requête en objet JSON
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppression des propriétés "_id" et "_userId" de l'objet de sauce
  delete sauceObject._id;
  delete sauceObject._userId;

  // Création d'un nouvel objet de sauce en utilisant les données fournies dans la requête
  // et en ajoutant l'ID de l'utilisateur connecté ainsi que l'URL de l'image uploadée
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Enregistrement de la sauce dans la base de données en utilisant la méthode save de Mongoose
  sauce
    .save()
    // Si l'enregistrement a réussi, renvoie un code de réussite 201 et un message
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    // Si l'enregistrement a échoué, renvoie un code d'erreur 400 et les détails de l'erreur générés par Mongoose
    .catch((error) => res.status(400).json({ error }));
};

// Controlleur pour gérer les likes et dislikes
exports.likesManagement = (req, res, next) => {
  // Récupération de l'identifiant de l'utilisateur à partir de la requête
  const userId = req.body.userId;
  // Récupération de l'identifiant de la sauce à partir des paramètres de la requête
  const sauceId = req.params.id;
  // Récupération de l'information sur le like de l'utilisateur à partir du corps de la requête
  const like = req.body.like;
  // Si l'utilisateur clique sur le pouce "j'aime"
  if (like === 1) {
    // Mise à jour de la sauce avec l'identifiant sauceId
    Sauce.updateOne(
      { _id: sauceId },
      {
        // Opérateur "push" de MongoDB pour ajouter l'identifiant de l'utilisateur au tableau usersLiked
        $push: { usersLiked: userId },
        // Opérateur "increment" de MongoDB pour incrémenter le nombre de likes
        $inc: { likes: +1 },
      }
    )
      // En cas de réussite, renvoi d'un message de réussite
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      // En cas d'erreur, renvoi de l'erreur
      .catch((error) => res.status(400).json({ error }));
  }
  // Si l'utilisateur clique sur le pouce "je n'aime pas"
  if (like === -1) {
    // Mise à jour de la sauce avec l'identifiant sauceId
    Sauce.updateOne(
      { _id: sauceId },
      {
        // Opérateur "push" de MongoDB pour ajouter l'identifiant de l'utilisateur au tableau usersDisliked
        $push: { usersDisliked: userId },
        // Opérateur "increment" de MongoDB pour incrémenter le nombre de dislikes
        $inc: { dislikes: +1 },
      }
    )
      // En cas de réussite, renvoi d'un message de réussite
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      // En cas d'erreur, renvoi de l'erreur
      .catch((error) => res.status(400).json({ error }));
  }

  //Supprimier le like ou le dislike
  // Like === 0
  // Si like est égal à 0
  if (like === 0) {
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        // Suppression du like
        // Si l'utilisateur a déjà cliqué sur le pouce like, c'est-à-dire si l'userId est inclus dans le tableau des usersLiked
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // Operateur mongoDB "pull"
            // On supprime l'userId du tableau des usersLiked et on décrémente likes
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Like retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        // Suppression du dislike
        // Si l'utilisateur a déjà cliqué sur le pouce dislike, c'est-à-dire si l'userId est inclus dans le tableau des usersDisliked
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // Operateur mongoDB "pull"
            // On supprime l'userId du tableau des usersDisliked et on décrémente dislikes
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Dislike retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// Controleur pour l'affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find() pour récupérer toutes les sauces de la base de données
  Sauce.find()
    // En cas de succès, on renvoie un tableau contenant toutes les sauces sous forme de JSON avec un statut HTTP 200 (OK)
    .then((sauces) => res.status(200).json(sauces))
    // En cas d'erreur, on renvoie un message d'erreur avec un statut HTTP 400 (Bad Request)
    .catch((error) => res.status(400).json({ error }));
};

// Contrôleur pour l'affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
  // Récupère la sauce avec l'ID spécifié dans la requête
  Sauce.findOne({ _id: req.params.id })
    // Si la sauce est trouvée, renvoie la sauce en réponse
    .then((sauce) => res.status(200).json(sauce))
    // Si une erreur se produit, renvoie un message d'erreur
    .catch((error) => res.status(400).json({ error }));
};

// Contrôleur pour la modification d'une sauce
exports.modifySauce = (req, res, next) => {
  // Si une image a été téléchargée avec la requête, elle est ajoutée à l'objet 'sauceObject'
  // sinon, seuls les champs du corps de la requête sont ajoutés
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Suppression de l'identifiant d'utilisateur dans l'objet sauce
  delete sauceObject._userId;

  // Recherche de la sauce correspondant à l'identifiant dans les paramètres de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification si l'auteur de la sauce correspond à la personne connectée
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Requête non autorisée!" });
      }
      // Si oui, vérification de la présence d'un fichier image
      else {
        const testReqFile = req.file;
        // Si aucun fichier n'a été téléchargé, seules les modifications sont mises à jour
        if (!testReqFile) {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(401).json({ error }));
        }
        // Sinon, l'ancien fichier image doit être supprimé et les modifications mises à jour
        else {
          // Récupération du nom du fichier de l'image existante
          const filenameStock = sauce.imageUrl.split("/images/")[1];
          // Suppression de l'ancien fichier image
          fs.unlink(`images/${filenameStock}`, () => {
            // Mise à jour des modifications
            Sauce.updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Ce contrôleur permet de supprimer une sauce dans la base de données
exports.deleteSauce = (req, res, next) => {
  // Recherche de la sauce correspondant à l'identifiant dans les paramètres de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification si l'auteur de la sauce correspond à la personne connectée
      if (sauce.userId != req.auth.userId) {
        // Renvoi d'une erreur si la requête n'est pas autorisée
        res.status(403).json({ message: "Requête non autorisée !" });
      } else {
        // Récupération du nom du fichier de l'image existante
        const filenameStock = sauce.imageUrl.split("/images/")[1];
        // Suppression du fichier image de la sauce
        fs.unlink(`images/${filenameStock}`, () => {
          // Suppression de la sauce dans la base de données
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      // Renvoi d'une erreur si une erreur s'est produite lors de la suppression de la sauce
      res.status(500).json({ error });
    });
};
