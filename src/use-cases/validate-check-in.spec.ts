import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { CheckInAlreadyProcessedError } from './errors/check-in-already-processed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn).toMatchObject({
      id: expect.any(String),
      user_id: expect.any(String),
      gym_id: expect.any(String),
      validated_at: expect.any(Date),
      created_at: expect.any(Date),
    })

    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      checkIn.validated_at,
    )
  })

  it('should not be able to validate the same check-in twice', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      checkIn.validated_at,
    )

    expect(checkInsRepository.checkIns).toHaveLength(1)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(CheckInAlreadyProcessedError)
  })

  it('should not be able to validate non-existent check-in', async () => {
    await expect(
      sut.execute({
        checkInId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(checkInsRepository.checkIns).toHaveLength(0)
  })
})
