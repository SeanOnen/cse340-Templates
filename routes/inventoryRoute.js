// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")
const authorize = require("../utilities/authorize")

/* ==========================
 * Inventory Management
 * ========================== */
router.get(
  "/",
  authorize.checkEmployeeOrAdmin,
  invController.buildManagementView
)

/* ==========================
 * Add Classification
 * ========================== */
router.get(
  "/add-classification",
  authorize.checkEmployeeOrAdmin,
  invController.buildAddClassification
)

router.post(
  "/add-classification",
  authorize.checkEmployeeOrAdmin,
  classificationValidate.addClassificationRules(),
  classificationValidate.checkClassificationData,
  invController.addClassification
)

/* ==========================
 * Add Inventory
 * ========================== */
router.get(
  "/add-inventory",
  authorize.checkEmployeeOrAdmin,
  invController.buildAddInventory
)

router.post(
  "/add-inventory",
  authorize.checkEmployeeOrAdmin,
  inventoryValidate.addInventoryRules(),
  inventoryValidate.checkInventoryData,
  invController.addInventory
)

/* ==========================
 * Public Inventory Views
 * ========================== */
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:inv_id", invController.buildInventoryDetail)

module.exports = router