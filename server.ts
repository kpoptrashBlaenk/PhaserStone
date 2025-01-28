import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cardsApiRoute from './src/api/cards-api'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const corsOrigin = (process.env.DB_EXTERNAL_HOST || `http://localhost:${process.env.PORT}`) + '/'

app.use(
  cors({
    origin: corsOrigin,
    methods: 'GET,POST,PUT,DELETE',
  })
)

app.use('/', express.static(path.join(__dirname, 'dist')))

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use('/api/cards', cardsApiRoute)

// Start the server
app.listen(PORT, () => {
  console.log(`API running on ` + (process.env.DB_EXTERNAL_HOST || `http://localhost:${process.env.PORT}`))
})
