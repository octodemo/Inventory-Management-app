import express from 'express'
import { join, resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { createApp } from './app'
import { loadAuthConfig } from './config/authConfig'
import { DatabaseIamClient } from './services/iamClient'
import { InMemorySessionStore } from './services/sessionStore'
import { JwtTokenService } from './services/tokenService'
import { PrismaUserRepository } from './services/userRepository'

process.loadEnvFile?.('.env')

const PORT = process.env.PORT || 3000

const authConfig = loadAuthConfig()
const prisma = new PrismaClient()
const userRepository = new PrismaUserRepository(prisma)

const app = createApp({
  iamClient: new DatabaseIamClient(userRepository),
  tokenService: new JwtTokenService({
    secret: authConfig.jwtSecret,
    ttlSeconds: authConfig.sessionTtlSeconds,
  }),
  sessionStore: new InMemorySessionStore(),
  userRepository,
  sessionTtlSeconds: authConfig.sessionTtlSeconds,
})

// Serve the built frontend when it is available, with SPA history fallback
const frontendDist = resolve('src/frontend/dist')
app.use(express.static(frontendDist))
app.get('*', (_req, res) => {
  res.sendFile(join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
