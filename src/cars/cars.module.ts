import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarsService } from './cars.service';
import { CarsRepository } from './cars.repository';
import { UsersModule } from '../users/users.module';
import { CarsMapper } from './dto/cars.mapper';

@Module({
  controllers: [CarsController],
  imports: [TypeOrmModule.forFeature([Car]), UsersModule],
  providers: [CarsService, CarsRepository, CarsMapper],
  exports: [CarsService, CarsMapper],
})
export class CarsModule {}
