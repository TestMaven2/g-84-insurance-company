import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Car } from './car.entity';

@Controller('cars')
export class CarsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() car: Car): Car {
    console.log('Saved car:', car);
    return car;
  }

  @Get()
  getAll(): Car[] {
    const car1: Car = new Car();
    car1.brand = 'Toyota';
    const car2: Car = new Car();
    car2.brand = 'Nissan';
    return [car1, car2];
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Car {
    console.log('Id:', id);
    const car: Car = new Car();
    car.brand = 'Honda';
    return car;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ParseIntPipe) id: number, @Body() car: Car): void {
    console.log('Id:', id);
    console.log('New color:', car.color);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteById(@Param('id', ParseIntPipe) id: number): void {
    console.log('Deleted id:', id);
  }

  @Patch(':carId/set-owner/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  setOwner(
    @Param('carId', ParseIntPipe) carId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): void {
    console.log('Car id:', carId);
    console.log('Owner id:', userId);
  }
}
