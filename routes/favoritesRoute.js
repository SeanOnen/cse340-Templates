// Needed Resources
const express = require("express")
const router = new express.Router()
const favoritesController = require("../controllers/favoritesController")
const authorize = require("../utilities/authorize")

/* ==========================
 * View Favorites (Logged-in users only)
 * ========================== */
router.get(
  "/",
  authorize.checkLogin, 
  favoritesController.buildFavoritesView
)

/* ==========================
 * Add Favorite
 * ========================== */
router.post(
  "/add",
  authorize.checkLogin,
  favoritesController.addFavorite
)

/* ==========================
 * Remove Favorite
 * ========================== */
router.post(
  "/remove",
  authorize.checkLogin,
  favoritesController.removeFavorite
)

module.exports = router