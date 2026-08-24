import express from 'express'
import inventoryRouter from './routes/inventory.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes will be registered here by implement-agent
app.use('/api/inventory', inventoryRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
