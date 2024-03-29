import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history ', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)

    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-01' }),
        expect.objectContaining({ gym_id: 'gym-02' }),
      ]),
    )

    expect(checkIns).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          user_id: expect.any(String),
          gym_id: expect.any(String),
          validated_at: null,
          created_at: expect.any(Date),
        },
      ]),
    )
  })

  it('should be able to fetch paginated check-in history ', async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${index}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)

    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' }),
      ]),
    )
  })
})
