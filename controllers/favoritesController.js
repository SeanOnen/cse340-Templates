const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/")

/* ***************************
 * Add Vehicle to Favorites
 * ************************** */
async function addFavorite(req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    // Prevent duplicates
    const alreadyFavorite = await favoritesModel.checkIfFavorite(account_id, inv_id)

    if (alreadyFavorite) {
      req.flash("notice", "Vehicle is already in your favorites.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    await favoritesModel.addFavorite(account_id, inv_id)

    req.flash("notice", "Vehicle added to favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Add Favorite Error:", error)
    req.flash("notice", "Sorry, could not add favorite.")
    return res.redirect("/")
  }
}

/* ***************************
 * Remove Vehicle from Favorites
 * ************************** */
async function removeFavorite(req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    await favoritesModel.removeFavorite(account_id, inv_id)

    req.flash("notice", "Vehicle removed from favorites.")
    return res.redirect("/favorites")
  } catch (error) {
    console.error("Remove Favorite Error:", error)
    req.flash("notice", "Sorry, could not remove favorite.")
    return res.redirect("/favorites")
  }
}

/* ***************************
 * Build Favorites View
 * ************************** */
async function buildFavoritesView(req, res) {
  try {
    const nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    const favorites = await favoritesModel.getFavoritesByAccount(account_id)

    res.render("favorites/index", {
      title: "My Favorite Vehicles",
      nav,
      favorites
    })
  } catch (error) {
    console.error("Build Favorites View Error:", error)
    req.flash("notice", "Unable to load favorites.")
    return res.redirect("/account")
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  buildFavoritesView
}