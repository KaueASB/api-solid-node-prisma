import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { app } from '../../app'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11912345678',
        latitude: -23.6971343,
        longitude: -46.5063204,
      })

    await request(app.server)
      .post('/gyms')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11912345678',
        latitude: -23.6971343,
        longitude: -46.5063204,
      })

    const response = await request(app.server)
      .get('/gyms/search?query=scr')
      .auth(token, { type: 'bearer' })

    expect(response.status).toBe(200)

    expect(response.body.gyms).toHaveLength(2)
  })
})
