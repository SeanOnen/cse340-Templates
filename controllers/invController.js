const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getInventoryById(inv_id)

    if (!vehicleData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    const detailHTML = utilities.buildVehicleDetail(vehicleData)
    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      content: detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional server error")
  } catch (error) {
    next(error)
  }
}

module.exports = invCont