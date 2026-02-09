const pool = require("../database/")

/* *****************************
 * Get account by email
 ***************************** */
async function getAccountByEmail(email) {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const result = await pool.query(sql, [email])
  return result.rows[0]
}

/* *****************************
 * Get account by ID
 ***************************** */
async function getAccountById(account_id) {
  const sql = "SELECT * FROM account WHERE account_id = $1"
  const result = await pool.query(sql, [account_id])
  return result.rows[0]
}

/* *****************************
 * Update account info
 ***************************** */
async function updateAccount(account) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
    RETURNING *
  `
  const result = await pool.query(sql, [
    account.account_firstname,
    account.account_lastname,
    account.account_email,
    account.account_id,
  ])
  return result.rowCount
}

/* *****************************
 * Update password
 ***************************** */
async function updatePassword(password, account_id) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
  `
  const result = await pool.query(sql, [password, account_id])
  return result.rowCount
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}