import express from 'express'
import pool from './src/database/database'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.API_PORT || 3000

app.use(express.json())

app.use(
  cors({
    origin: `http://localhost:${process.env.PHASER_PORT}`,
    methods: 'GET,POST,PUT,DELETE',
  })
)

app.get('/api/cards', async (req: any, res: any) => {
  try {
    const query = `
    SELECT
      c.id AS "id",
      c.track_id AS "trackId",
      c.name AS "name",
      c.text AS "text",
      c.cost AS "cost",
      c.attack AS "attack",
      c.health AS "health",
      a.asset_key AS "assetKey",
      CASE
        WHEN c.battlecry_id IS NOT NULL THEN
          json_build_object(
            'target', bc_tg.target,
            'type', bc_tp.type,
            'amount', bc.amount
          )
        ELSE NULL
      END AS "battlecry"
    FROM cards c
    LEFT JOIN assets a ON c.asset_id = a.id
    LEFT JOIN battlecries bc ON c.battlecry_id = bc.id
    LEFT JOIN battlecry_targets bc_tg ON bc.battlecry_target_id = bc_tg.id
    LEFT JOIN battlecry_types bc_tp ON bc.battlecry_type_id = bc_tp.id
    `
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching cards:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
