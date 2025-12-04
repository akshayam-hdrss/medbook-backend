const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");

router.get(
  "/favorites-details/:userId",
  favoritesController.getFavoritesByUserdetails
);
router.post("/favorites", favoritesController.addFavorite);
router.get("/favorites/:userId", favoritesController.getFavoritesByUser);
router.put("/favorites/:id", favoritesController.updateFavorite);
router.delete("/favorites/:id", favoritesController.deleteFavorite);

module.exports = router;
