import express, { Router } from 'express'
import pool from '../database/database.config'

const router: Router = express.Router()

router.get('/', async (req, res) => {
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

export default router
