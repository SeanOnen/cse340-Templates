// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

/* ==========================
 * Inventory Management
 * ========================== */
router.get("/", invController.buildManagementView)

/* ==========================
 * Add Classification
 * ========================== */
router.get("/add-classification", invController.buildAddClassification)

router.post(
  "/add-classification",
  classificationValidate.addClassificationRules(),
  classificationValidate.checkClassificationData,
  invController.addClassification
)

/* ==========================
 * Add Inventory
 * ========================== */
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  inventoryValidate.addInventoryRules(),
  inventoryValidate.checkInventoryData,
  invController.addInventory
)

/* ==========================
 * Inventory Views
 * ========================== */
router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/detail/:inv_id", invController.buildInventoryDetail)

/* ==========================
 * Intentional Error Route
 * ========================== */
router.get("/error-test", invController.triggerError)

module.exports = router