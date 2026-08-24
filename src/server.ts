import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes will be registered here by implement-agent

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
