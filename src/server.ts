import express from 'express'
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

// Serve the built frontend when it is available
app.use(express.static('src/frontend/dist'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
