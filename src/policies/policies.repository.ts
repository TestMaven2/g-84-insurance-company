import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './policy.entity';

@Injectable()
export class PoliciesRepository {
  constructor(
    @InjectRepository(Policy)
    private readonly repository: Repository<Policy>,
  ) {}

  async save(policy: Policy): Promise<Policy> {
    return this.repository.save(policy);
  }

  async findAllActive(): Promise<Policy[]> {
    return this.repository.find({
      where: {
        active: true,
      },
      relations: {
        cars: true,
      },
    });
  }

  async findById(id: number): Promise<Policy | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        cars: true,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
