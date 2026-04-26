import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { getAuthToken, getAdminToken } from './helpers/authHelper.js'

describe('Task API /api/tasks', () => {

  it('should allow admin to create a task', async () => {
    const { token } = await getAdminToken()
    const { userId } = await getAuthToken() // Create a member to assign to

    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'High',
      assignedTo: [userId],
      todoChecklist: [{ text: 'Step 1' }]
    }

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData)

    expect(res.status).toBe(201)
    expect(res.body.task.title).toBe('Test Task')
  })

  it('should block member from creating a task', async () => {
    const { token } = await getAuthToken()

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Illegal Task' })

    expect(res.status).toBe(403)
  })

  it('should auto-calculate progress when checklist is updated', async () => {
    const { token: adminToken } = await getAdminToken()
    const { token: userToken, userId } = await getAuthToken()

    // 1. Admin creates task with 2 items
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Checklist Test',
        assignedTo: [userId],
        todoChecklist: [
          { text: 'A', completed: false },
          { text: 'B', completed: false }
        ]
      })

    const taskId = createRes.body.task._id

    // 2. User completes 1 item (50%)
    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}/todo`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        todoChecklist: [
          { text: 'A', completed: true },
          { text: 'B', completed: false }
        ]
      })

    expect(updateRes.status).toBe(200)
    expect(updateRes.body.task.progress).toBe(50)
    expect(updateRes.body.task.status).toBe('In Progress')
  })
})
