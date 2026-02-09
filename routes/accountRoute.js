const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const auth = require("../utilities/auth")
const validate = require("../utilities/account-validation")

/* ==========================
 * Login
 * ========================== */
router.get("/login", accountController.buildLogin)
router.post("/login", accountController.accountLogin)

/* ==========================
 * Account management (protected)
 * ========================== */
router.get(
  "/",
  auth.checkJWTToken,
  (req, res, next) => {
    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to access your account.")
      return res.redirect("/account/login")
    }
    next()
  },
  accountController.buildAccountManagement
)

/* ==========================
 * Update account view
 * ========================== */
router.get(
  "/update/:account_id",
  auth.checkJWTToken,
  accountController.buildUpdateAccount
)

/* ==========================
 * Process account update
 * ========================== */
router.post(
  "/update",
  auth.checkJWTToken,
  validate.updateAccountRules(),
  validate.checkResults,
  accountController.updateAccount
)

/* ==========================
 * Process password update
 * ========================== */
router.post(
  "/update-password",
  auth.checkJWTToken,
  validate.updatePasswordRules(),
  validate.checkResults,
  accountController.updatePassword
)

/* ==========================
 * Logout
 * ========================== */
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})

module.exports = router