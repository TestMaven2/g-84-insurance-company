import { InternalServerErrorException } from '@nestjs/common';

export class ConfigurationException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
