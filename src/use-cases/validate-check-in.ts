import { CheckIn } from '@prisma/client'
import { differenceInMinutes } from 'date-fns'

import { ICheckInsRepository } from '@/repositories/interface-check-ins-repository'

import { CheckInAlreadyProcessedError } from './errors/check-in-already-processed-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

const TWENTY_MINUTES = 20

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

    const diffInMinutesFromCheckInCreation = differenceInMinutes(
      new Date(),
      checkIn.created_at,
    )

    if (diffInMinutesFromCheckInCreation > TWENTY_MINUTES) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()
    await this.checkInsRepository.validateCheckIn(checkIn)
    return { checkIn }
  }
}
