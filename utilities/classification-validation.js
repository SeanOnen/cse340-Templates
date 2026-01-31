const { body, validationResult } = require("express-validator")

const classificationValidate = {}

classificationValidate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must contain no spaces or special characters.")
  ]
}

classificationValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await require("./index").getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }
  next()
}

module.exports = classificationValidate