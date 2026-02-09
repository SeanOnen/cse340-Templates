const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* ******************************
 * Account update validation rules
 ****************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email)
        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already exists.")
        }
      }),
  ]
}

/* ******************************
 * Password update validation rules
 ****************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters and include uppercase, number, and special character."
      ),
  ]
}

/* ******************************
 * Check validation results
 ****************************** */
validate.checkResults = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.errors = errors.array()
    return next()
  }
  next()
}

module.exports = validate