import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';

@Injectable()
export class CarsRepository {
  constructor(
    @InjectRepository(Car)
    private readonly repository: Repository<Car>,
  ) {}

  async save(car: Car): Promise<Car> {
    return this.repository.save(car);
  }

  async findAllActive(): Promise<Car[]> {
    return this.repository.find({
      where: { active: true },
      relations: {
        owner: true,
      },
    });
  }

  async findById(id: number): Promise<Car | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async isVinExists(vin: string): Promise<boolean> {
    return this.repository.existsBy({ vin });
  }
}
