/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const auth = require("./utilities/auth")
const accountRoute = require("./routes/accountRoute")
const favoritesRoute = require("./routes/favoritesRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Session & Flash Middleware
 *************************/
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
)

app.use(flash())

app.use((req, res, next) => {
  res.locals.notice = req.flash("notice")
  next()
})

app.use((req, res, next) => {
  if (!res.locals.loggedin) {
    res.locals.loggedin = false
  }

  if (!res.locals.accountData) {
    res.locals.accountData = null
  }

  next()
})

/* ***********************
 * BODY PARSING MIDDLEWARE
 *************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(auth.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Account routes
app.use("/account", accountRoute)

// Inventory routes
app.use("/inv", inventoryRoute)

// Favorites routes
app.use("/favorites", favoritesRoute)

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

/* ***********************
 * Error Handler Middleware
 *************************/
const utilities = require("./utilities/")

app.use(async (err, req, res, next) => {
  console.error(err.stack)
  const nav = await utilities.getNav()
  res.status(err.status || 500).render("errors/error", {
    title: err.status === 404 ? "Page Not Found" : "Server Error",
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})