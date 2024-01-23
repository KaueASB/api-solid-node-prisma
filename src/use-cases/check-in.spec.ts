import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym-01',
      title: 'Gym Tester',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
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
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 23, 12, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 0, 24, 20, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toMatchObject({
      id: expect.any(String),
      user_id: expect.any(String),
      gym_id: expect.any(String),
      validated_at: null,
      created_at: expect.any(Date),
    })
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'Gym Tester 2',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6462524),
      longitude: new Decimal(-46.5333891),
    })

    await expect(
      sut.execute({
        userId: 'user-02',
        gymId: 'gym-01',
        userLatitude: -23.6971343,
        userLongitude: -46.5063204,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
