import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsNotConfirmedException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} is not confirmed`, HttpStatus.FORBIDDEN);
  }
}
