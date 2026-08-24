import express from 'express'
import { createCatalogRouter } from './routes/catalogRoutes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

app.use('/api', createCatalogRouter())

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
