import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>

const KEY_LENGTH = 64

/**
 * Hashes a plain text password using scrypt.
 *
 * @param password - Plain text password to hash.
 * @returns A `salt:hash` string, both parts hex encoded.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16)
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH)
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

/**
 * Verifies a plain text password against a stored scrypt hash.
 *
 * @param password - Plain text password supplied by the caller.
 * @param storedHash - Stored `salt:hash` value produced by {@link hashPassword}.
 * @returns `true` when the password matches, otherwise `false`.
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [saltHex, keyHex] = storedHash.split(':')
  if (!saltHex || !keyHex) {
    return false
  }

  const expectedKey = Buffer.from(keyHex, 'hex')
  const derivedKey = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expectedKey.length)

  return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey)
}
