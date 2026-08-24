import express from 'express'
import { createUploadRouter } from './routes/uploadRoutes'
import { createUploadService } from './services/uploadService'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

app.use('/api/upload', createUploadRouter(createUploadService()))

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

export { app }
