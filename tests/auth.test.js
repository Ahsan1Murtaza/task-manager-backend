import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { registerUser, getAuthToken } from './helpers/authHelper.js'

describe('Auth API /api/auth', () => {

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const { res } = await registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body.name).toBe('John Doe')
      expect(res.body.role).toBe('member')
    })

    it('should not register user with existing email', async () => {
      await registerUser({ email: 'duplicate@test.com' })
      const { res } = await registerUser({ email: 'duplicate@test.com' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('User Already Exists')
    })
    
    it('should register as admin if correct invite token is provided', async () => {
      process.env.ADMIN_INVITE_TOKEN = 'secret123'
      const { res } = await registerUser({ 
        email: 'admin@test.com', 
        adminInviteToken: 'secret123' 
      })

      expect(res.status).toBe(200)
      expect(res.body.role).toBe('admin')
    })
  })

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'login@test.com'
      const password = 'password123'
      await registerUser({ email, password })

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })

    it('should fail login with wrong password', async () => {
      const email = 'wrongpass@test.com'
      await registerUser({ email, password: 'correct' })

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'wrong' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Invalid credentials')
    })
  })

  describe('GET /profile', () => {
    it('should get profile with valid JWT', async () => {
      const { token, payload } = await getAuthToken()

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.email).toBe(payload.email)
    })

    it('should fail to get profile without token', async () => {
      const res = await request(app).get('/api/auth/profile')
      expect(res.status).toBe(401)
    })
  })
})
