export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Source files use ESM-style relative imports with an explicit `.js`
  // extension (e.g. `import { prisma } from '../lib/prisma.js'`), which is
  // the correct NodeNext/TypeScript convention but is not resolvable by
  // Jest's default CommonJS resolver (there is no literal `.js` file next to
  // the `.ts` source). This mapper strips the extension so Jest resolves the
  // specifier to the sibling `.ts` file instead. Required for any unit test
  // to be able to import production source files.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
}
