import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarsService } from './cars.service';
import { CarsRepository } from './cars.repository';
import { UsersModule } from '../users/users.module';
import { CarsMapper } from './dto/cars.mapper';
import { CarsValidator } from './validation/cars.validator';

@Module({
  controllers: [CarsController],
  imports: [TypeOrmModule.forFeature([Car]), UsersModule],
  providers: [CarsService, CarsRepository, CarsMapper, CarsValidator],
  exports: [CarsService, CarsMapper],
})
export class CarsModule {}
