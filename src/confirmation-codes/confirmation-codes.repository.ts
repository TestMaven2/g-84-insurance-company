import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmationCode } from './confirmation-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfirmationCodesRepository {
  constructor(
    @InjectRepository(ConfirmationCode)
    private readonly repository: Repository<ConfirmationCode>,
  ) {}

  async save(confirmationCode: ConfirmationCode): Promise<ConfirmationCode> {
    return this.repository.save(confirmationCode);
  }
}
