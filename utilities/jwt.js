const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateAccessToken(accountData) {
  return jwt.sign(
    accountData,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  )
}

module.exports = { generateAccessToken }