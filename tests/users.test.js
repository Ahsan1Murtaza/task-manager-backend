import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { getAuthToken, getAdminToken } from './helpers/authHelper.js'

describe('User API /api/users', () => {

  it('should allow admin to list all members', async () => {
    const { token } = await getAdminToken()
    await getAuthToken() // Create a member to be listed

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should block members from listing all users', async () => {
    const { token } = await getAuthToken()

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
  })

  it('should get user by ID', async () => {
    const { token, userId } = await getAuthToken()

    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(userId)
  })
})
