import express from 'express'
import uploadExportRouter from './routes/uploadExportRoutes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

app.use('/api', uploadExportRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
