import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { app } from '../../app'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Node Gym',
        latitude: -23.6971343,
        longitude: -46.5063204,
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .auth(token, { type: 'bearer' })

    expect(response.status).toBe(204)

    const findCheckInById = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(findCheckInById).toEqual(
      expect.objectContaining({
        validated_at: expect.any(Date),
      }),
    )
  })
})
