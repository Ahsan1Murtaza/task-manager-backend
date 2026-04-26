import request from 'supertest'
import app from '../../app.js'

/**
 * Register a user and return the full response body (includes token).
 * @param {object} overrides - Fields to override defaults
 */
export const registerUser = async (overrides = {}) => {
  const defaults = {
    name: 'Test User',
    email: `user_${Date.now()}@test.com`,
    password: 'password123',
  }
  const payload = { ...defaults, ...overrides }

  const res = await request(app).post('/api/auth/register').send(payload)
  return { res, payload }
}

/**
 * Register a user then login and return the JWT token.
 * @param {object} overrides
 */
export const getAuthToken = async (overrides = {}) => {
  const { res, payload } = await registerUser(overrides)
  return { token: res.body.token, userId: res.body._id, payload }
}

/**
 * Register an admin user using the ADMIN_INVITE_TOKEN env var, then return token.
 */
export const getAdminToken = async () => {
  const adminInviteToken = process.env.ADMIN_INVITE_TOKEN
  const email = `admin_${Date.now()}@test.com`

  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email,
    password: 'adminpass123',
    adminInviteToken,
  })
  return { token: res.body.token, userId: res.body._id, email }
}
