import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { app } from '../../app'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -23.6891543,
        longitude: -46.5069305,
      })

    await request(app.server)
      .post('/gyms')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Far Gym',
        description: null,
        phone: null,
        latitude: -23.1867991,
        longitude: -46.2025623,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.6891543,
        longitude: -46.5069305,
        page: 1,
      })
      .auth(token, { type: 'bearer' })

    console.log(response.body.gyms)

    expect(response.status).toBe(200)

    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
