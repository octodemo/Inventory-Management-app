import express from 'express'
import branchesRouter from './routes/branches.js'
import hierarchiesRouter from './routes/hierarchies.js'
import inventoryRouter from './routes/inventory.js'
import premisesRouter from './routes/premises.js'
import regionalOfficesRouter from './routes/regionalOffices.js'
import reportsRouter from './routes/reports.js'
import supervisorsRouter from './routes/supervisors.js'
import usageRouter from './routes/usage.js'
import vendorsRouter from './routes/vendors.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes will be registered here by implement-agent
app.use('/api/regional-offices', regionalOfficesRouter)
app.use('/api/branches', branchesRouter)
app.use('/api/supervisors', supervisorsRouter)
app.use('/api/premises', premisesRouter)
app.use('/api/usage', usageRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/hierarchies', hierarchiesRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
