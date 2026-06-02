import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import '@testing-library/jest-dom'
import { server } from '../mocks/server'

// Start MSW server
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

globalThis.localStorage = localStorageMock as any
