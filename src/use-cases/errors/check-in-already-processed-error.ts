export class CheckInAlreadyProcessedError extends Error {
  constructor() {
    super('Check-in was previously processed.')
  }
}
