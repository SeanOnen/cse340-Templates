const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT *
      FROM inventory
      WHERE inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    throw new Error("Database error getting inventory by ID")
  }
}

async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *
  `
  return await pool.query(sql, [classification_name])
}

async function addInventory(data) {
  const sql = `
    INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
  `
  const values = [
    data.inv_make,
    data.inv_model,
    parseInt(data.inv_year),
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    parseFloat(data.inv_price),
    parseInt(data.inv_miles),
    data.inv_color,
    parseInt(data.classification_id)
  ]

  return await pool.query(sql, values)
}
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory };