import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './dto/users.mapper';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository, UsersMapper],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
