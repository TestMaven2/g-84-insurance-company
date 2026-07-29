import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmationCode } from './confirmation-code.entity';
import { ConfirmationCodesRepository } from './confirmation-codes.repository';
import { ConfirmationCodesService } from './confirmation-codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCode])],
  providers: [ConfirmationCodesRepository, ConfirmationCodesService],
  exports: [ConfirmationCodesService],
})
export class ConfirmationCodesModule {}
