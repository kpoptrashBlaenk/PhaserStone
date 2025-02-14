import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cardsApiRoute from './src/api/cards-api'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const corsOrigin = (process.env.HOST || `http://localhost:${process.env.PORT}`) + '/'

app.use(
  cors({
    origin: corsOrigin,
    methods: 'GET,POST,PUT,DELETE',
  })
)

// Default game
app.use('/', express.static(path.join(__dirname, 'dist')))

// Assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// Api for cards
app.use('/api/cards', cardsApiRoute)

// // Fallback: Default game
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start the server
app.listen(PORT, () => {
  console.log(`API running on ` + (process.env.HOST || `http://localhost:${process.env.PORT}`))
})
