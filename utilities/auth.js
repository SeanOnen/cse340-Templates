const jwt = require("jsonwebtoken")
require("dotenv").config()

const auth = {}

/* ****************************************
 * Check JWT token and set locals
 **************************************** */
auth.checkJWTToken = (req, res, next) => {
  const token = req.cookies?.jwt

  if (!token) {
    res.locals.loggedin = false
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      res.locals.loggedin = false
      return next()
    }

    res.locals.loggedin = true
    res.locals.accountData = accountData
    next()
  })
}

auth.checkEmployeeOrAdmin = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in with appropriate credentials.")
    return res.redirect("/account/login")
  }

  const role = res.locals.accountData.account_type

  if (role === "Employee" || role === "Admin") {
    return next()
  }

  req.flash("notice", "You do not have permission to access that resource.")
  return res.redirect("/account/login")
}

module.exports = auth