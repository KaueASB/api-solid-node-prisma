import { Gym } from '@prisma/client'

import { IGymsRepository } from '@/repositories/interface-gyms-repository'

export interface CreateGymUseCaseRequestBody {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequestBody): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
