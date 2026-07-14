import { Injectable } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { Policy } from './policy.entity';
import { Car } from '../cars/car.entity';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly repository: PoliciesRepository,
    private readonly carsService: CarsService,
  ) {}

  async create(policy: Policy): Promise<Policy> {
    policy.active = true;
    return await this.repository.save(policy);
  }

  async getAllActivePolicies(): Promise<Policy[]> {
    const policies: Policy[] = await this.repository.findAllActive();
    policies.forEach((p: Policy): void => this.excludeInactiveCars(p));
    return policies;
  }

  private excludeInactiveCars(policy: Policy): void {
    policy.cars = policy.cars.filter((c: Car): boolean => c.active);
  }

  async getActivePolicyById(id: number): Promise<Policy> {
    const policy: Policy | null = await this.repository.findById(id);

    if (!policy || !policy.active) {
      throw Error();
    }

    return policy;
  }

  async deleteById(id: number): Promise<void> {
    const policy: Policy = await this.getActivePolicyById(id);
    policy.active = false;
    await this.repository.save(policy);
  }

  async restoreById(id: number): Promise<void> {
    const policy: Policy | null = await this.repository.findById(id);

    if (policy && !policy.active) {
      policy.active = true;
      await this.repository.save(policy);
    }
  }

  async addActiveCarToActivePolicy(
    policyId: number,
    carId: number,
  ): Promise<void> {
    const policy: Policy = await this.getActivePolicyById(policyId);
    const car: Car = await this.carsService.getActiveCarById(carId);

    policy.cars.push(car);
    await this.repository.save(policy);
  }
}
