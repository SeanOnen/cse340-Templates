const authorize = {}

/* ****************************************
 * Restrict inventory admin access
 **************************************** */
authorize.checkEmployeeOrAdmin = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in to access inventory management.")
    return res.redirect("/account/login")
  }

  const accountType = res.locals.accountData?.account_type

  if (accountType === "Employee" || accountType === "Admin") {
    return next()
  }

  req.flash(
    "notice",
    "You do not have permission to access that resource."
  )
  return res.redirect("/account/login")
}

/* ****************************************
 * Restrict access to logged-in users
 **************************************** */
authorize.checkLogin = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in to access this feature.")
    return res.redirect("/account/login")
  }

  return next()
}

module.exports = authorize