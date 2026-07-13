import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './policy.entity';

@Module({
  controllers: [PoliciesController],
  imports: [TypeOrmModule.forFeature([Policy])],
})
export class PoliciesModule {}
