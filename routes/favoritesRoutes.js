const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");

router.post("/favorites", favoritesController.addFavorite);
router.get("/favorites/:userId", favoritesController.getFavoritesByUser);
router.get("/favorites-details/:userId", favoritesController.getFavoritesByUserdetails);
router.put("/favorites/:id", favoritesController.updateFavorite);
router.delete("/favorites/:id", favoritesController.deleteFavorite);

module.exports = router;
