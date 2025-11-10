const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicalFavouritesController");

// POST -> Add favourite
router.post("/", controller.addFavourite);

// GET -> Get favourites by doctorId
router.get("/:doctorId", controller.getFavouritesByDoctor);

// DELETE -> Remove favourite
router.delete("/:id", controller.deleteFavourite);

module.exports = router;