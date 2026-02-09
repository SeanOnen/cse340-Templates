const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *****************************
 * Deliver login view
 ***************************** */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

/* *****************************
 * Process login
 ***************************** */
async function accountLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    const token = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    })

    return res.redirect("/account")
  } catch (err) {
    next(err)
  }
}

/* *****************************
 * Account management view
 ***************************** */
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/index", {
      title: "Account Management",
      nav,
      accountData: res.locals.accountData,
    })
  } catch (err) {
    next(err)
  }
}

/* *****************************
 * Deliver account update view
 ***************************** */
async function buildUpdateAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(
      req.params.account_id
    )

    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

/* *****************************
 * Process account update
 ***************************** */
async function updateAccount(req, res, next) {
  try {
    if (req.errors) {
      const nav = await utilities.getNav()
      return res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: req.errors,
      })
    }

    const result = await accountModel.updateAccount(req.body)

    if (result) {
      req.flash("notice", "Account updated successfully.")
    } else {
      req.flash("notice", "Account update failed.")
    }

    return res.redirect("/account")
  } catch (err) {
    next(err)
  }
}

/* *****************************
 * Process password update
 ***************************** */
async function updatePassword(req, res, next) {
  try {
    if (req.errors) {
      const nav = await utilities.getNav()
      return res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: req.errors,
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.account_password, 10)

    const result = await accountModel.updatePassword(
      hashedPassword,
      req.body.account_id
    )

    if (result) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    return res.redirect("/account")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  buildLogin,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
}