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

/* ***********************
 * BODY PARSING MIDDLEWARE
 * (THIS FIXES req.body === undefined)
 *************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

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