import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { app } from '../../app'

describe('Create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Node Gym',
        description: 'Some description',
        phone: '11912345678',
        latitude: -23.6971343,
        longitude: -46.5063204,
      })

    expect(response.status).toBe(201)
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        created_at: expect.stringContaining('Z'),
      }),
    )
  })
})
