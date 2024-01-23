import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym-01',
      description: null,
      phone: null,
      latitude: -23.6971343,
      longitude: -46.5063204,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
