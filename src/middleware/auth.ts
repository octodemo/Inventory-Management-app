import { Request, Response, NextFunction } from 'express'

// Authentication middleware stub
// Will be implemented by implement-agent
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement authentication logic
  next()
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement authorization logic
    next()
  }
}
