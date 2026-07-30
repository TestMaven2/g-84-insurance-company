import { Injectable } from '@nestjs/common';
import { ConfirmationCodesRepository } from './confirmation-codes.repository';
import { User } from '../users/user.entity';
import { randomUUID } from 'node:crypto';
import { ConfirmationCode } from './confirmation-code.entity';
import { RegistrationException } from '../exceptions/types/registration.exception';

@Injectable()
export class ConfirmationCodesService {
  constructor(private readonly repository: ConfirmationCodesRepository) {}

  async generateConfirmationCode(user: User): Promise<string> {
    const codeValue: string = randomUUID();
    const now: number = Date.now();
    const expiration: Date = new Date(now + 24 * 60 * 60 * 1000);

    const codeEntity: ConfirmationCode = new ConfirmationCode();
    codeEntity.value = codeValue;
    codeEntity.expiration = expiration;
    codeEntity.user = user;

    await this.repository.save(codeEntity);

    return codeValue;
  }

  async validateCodeAndGetUser(codeValue: string): Promise<User> {
    const codeEntity: ConfirmationCode | null =
      await this.repository.findByValue(codeValue);

    if (!codeEntity || codeEntity.expiration < new Date()) {
      throw new RegistrationException(
        'Your confirmation code is invalid. Try to register again.',
      );
    }

    await this.repository.delete(codeEntity);
    return codeEntity.user;
  }
}
