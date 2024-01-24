import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/interface-check-ins-repository'

import { CheckInAlreadyProcessedError } from './errors/check-in-already-processed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (checkIn?.validated_at) {
      throw new CheckInAlreadyProcessedError()
    }

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.validateCheckIn(checkIn)

    return { checkIn }
  }
}
