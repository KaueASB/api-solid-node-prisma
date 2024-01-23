import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn).toMatchObject({
      id: expect.any(String),
      user_id: expect.any(String),
      gym_id: expect.any(String),
      validated_at: null,
      created_at: expect.any(Date),
    })
  })

  it('should not be able to check in twice the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 23, 12, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 23, 12, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2024, 0, 23, 20, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn).toMatchObject({
      id: expect.any(String),
      user_id: expect.any(String),
      gym_id: expect.any(String),
      validated_at: null,
      created_at: expect.any(Date),
    })
  })
})
