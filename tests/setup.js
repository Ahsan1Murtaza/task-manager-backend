import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

// Set default environment variables for testing
process.env.JWT_SECRET = 'test_secret_key_123'
process.env.ADMIN_INVITE_TOKEN = 'test_admin_token'
process.env.PORT = '5001' // Use different port than dev if needed

let mongod

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

// Clear all collections after each test to keep tests isolated
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// Disconnect and stop MongoDB after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
})
