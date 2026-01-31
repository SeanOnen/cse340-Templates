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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: res.locals.notice,
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result.rowCount === 1) {
    req.flash("notice", "Classification added successfully.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Classification failed.")
    res.redirect("/inv/add-classification")
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    data: {}
  })
}

invCont.addInventory = async function (req, res, next) {
  const result = await invModel.addInventory(req.body)

  if (result.rowCount === 1) {
    req.flash("notice", "Inventory item added successfully.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.redirect("/inv/add-inventory")
  }
}

module.exports = invCont