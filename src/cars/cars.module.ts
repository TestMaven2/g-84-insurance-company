import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';

@Module({
  controllers: [CarsController],
  imports: [TypeOrmModule.forFeature([Car])],
})
export class CarsModule {}
