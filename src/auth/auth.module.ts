import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [UsersModule],
})
export class AuthModule {}
