import path from 'path'
import fs from 'fs'
import pool from '../database.config'

/**
 * npm run reset
 *
 * Delete the database
 */
const executeReset = async () => {
  const filePath = path.join(__dirname, 'db-reset.sql')
  const sql = fs.readFileSync(filePath, 'utf-8')

  try {
    await pool.query(sql)
    console.log('Reset executed successfully')
  } catch (err) {
    console.error('Error executing reset', err)
  }
}

executeReset()
