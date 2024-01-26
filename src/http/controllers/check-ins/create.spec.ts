import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { app } from '../../app'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Node Gym',
        latitude: -23.6971343,
        longitude: -46.5063204,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .auth(token, { type: 'bearer' })
      .send({
        latitude: -23.6971343,
        longitude: -46.5063204,
      })

    expect(response.status).toBe(201)
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        created_at: expect.stringContaining('Z'),
        validated_at: null,
      }),
    )
  })
})
