import express from 'express'
import { downloadRouter } from './routes/downloadRoutes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes will be registered here by implement-agent
app.use('/api/download', downloadRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
