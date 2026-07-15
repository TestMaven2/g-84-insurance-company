import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './policy.entity';
import { PoliciesService } from './policies.service';
import { PoliciesRepository } from './policies.repository';
import { CarsModule } from '../cars/cars.module';
import { PoliciesMapper } from './dto/policies.mapper';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PoliciesController],
  imports: [TypeOrmModule.forFeature([Policy]), CarsModule, UsersModule],
  providers: [PoliciesService, PoliciesRepository, PoliciesMapper],
})
export class PoliciesModule {}
