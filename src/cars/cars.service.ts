import { Injectable } from '@nestjs/common';
import { Car } from './car.entity';
import { CarsRepository } from './cars.repository';
import { UsersService } from '../users/users.service';
import { CarsMapper } from './dto/cars.mapper';
import { CarSaveDto } from './dto/car.save-dto';
import { CarDto } from './dto/car.dto';
import { CarUpdateDto } from './dto/car.update-dto';
import { CarsValidator } from './validation/cars.validator';

@Injectable()
export class CarsService {
  constructor(
    private readonly repository: CarsRepository,
    private readonly userService: UsersService,
    private readonly mapper: CarsMapper,
    private readonly validator: CarsValidator,
  ) {}

  async create(saveDto: CarSaveDto): Promise<CarDto> {
    this.validator.validateSaveDto(saveDto);
    const entity: Car = this.mapper.mapDtoToEntity(saveDto);
    entity.active = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveCars(): Promise<CarDto[]> {
    const cars: Car[] = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(cars);
  }

  async getActiveCarById(id: number): Promise<CarDto> {
    const car: Car = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(car);
  }

  async getActiveEntityById(id: number): Promise<Car> {
    const car: Car | null = await this.repository.findById(id);

    if (!car || !car.active) {
      throw Error();
    }

    return car;
  }

  async update(id: number, updateDto: CarUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundCar: Car = await this.getActiveEntityById(id);
    foundCar.color = updateDto.newColor;
    await this.repository.save(foundCar);
  }

  async deleteById(id: number): Promise<void> {
    const car: Car = await this.getActiveEntityById(id);
    car.active = false;
    await this.repository.save(car);
  }

  async restoreById(id: number): Promise<void> {
    const car: Car | null = await this.repository.findById(id);

    if (car && !car.active) {
      car.active = true;
      await this.repository.save(car);
    }
  }

  async setActiveOwnerToActiveCar(
    carId: number,
    ownerId: number,
  ): Promise<void> {
    const car: Car = await this.getActiveEntityById(carId);
    car.owner = await this.userService.getActiveEntityById(ownerId);
    await this.repository.save(car);
  }
}
