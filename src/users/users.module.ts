import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './dto/users.mapper';
import { UsersValidator } from './validation/users.validator';
import { EmailModule } from '../email/email.module';
import { ConfirmationCodesModule } from '../confirmation-codes/confirmation-codes.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    ConfirmationCodesModule,
  ],
  providers: [UsersService, UsersRepository, UsersMapper, UsersValidator],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
