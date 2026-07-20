import { HttpException, HttpStatus } from '@nestjs/common';

export class EntitySaveException extends HttpException {
  constructor(entityTitle: string, fieldTitle: string) {
    super(
      `${entityTitle} save error: this ${fieldTitle} already exists`,
      HttpStatus.CONFLICT,
    );
  }
}
