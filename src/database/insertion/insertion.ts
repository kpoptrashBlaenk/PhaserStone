import path from 'path'
import fs from 'fs'
import pool from '../database.config'

const executeInsertion = async () => {
  const filePathBase = path.join(__dirname, 'db-insertion-base.sql')
  const sqlBase = fs.readFileSync(filePathBase, 'utf-8')

  const filePathRelations = path.join(__dirname, 'db-insertion-relations.sql')
  const sqlRelations = fs.readFileSync(filePathRelations, 'utf-8')

  try {
    await pool.query(sqlBase)
    await pool.query(sqlRelations)

    console.log('Insertion executed successfully')
  } catch (err) {
    console.error('Error executing insertion', err)
  }
}

executeInsertion()
