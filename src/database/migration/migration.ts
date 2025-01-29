import path from 'path'
import fs from 'fs'
import pool from '../database.config'

/**
 * npm run migrate
 *
 * Migration to create the database
 */
const executeMigration = async () => {
  const filePath = path.join(__dirname, 'db-migration.sql')
  const sql = fs.readFileSync(filePath, 'utf-8')

  try {
    await pool.query(sql)
    console.log('Migration executed successfully')
  } catch (err) {
    console.error('Error executing migration', err)
  }
}

executeMigration()
