import { Injectable } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { Policy } from './policy.entity';
import { Car } from '../cars/car.entity';
import { CarsService } from '../cars/cars.service';
import { PolicySaveDto } from './dto/policy.save-dto';
import { PolicyDto } from './dto/policy.dto';
import { UsersService } from '../users/users.service';
import { PoliciesMapper } from './dto/policies.mapper';
import { PoliciesValidator } from './validation/policies.validator';
import { User } from '../users/user.entity';
import { Role } from '../users/enums/role.enum';
import { RoleMismatchException } from '../exceptions/types/role-mismatch.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly repository: PoliciesRepository,
    private readonly carsService: CarsService,
    private readonly usersService: UsersService,
    private readonly mapper: PoliciesMapper,
    private readonly validator: PoliciesValidator,
  ) {}

  async create(saveDto: PolicySaveDto): Promise<PolicyDto> {
    this.validator.validateSaveDto(saveDto);
    const entity: Policy = this.mapper.mapDtoToEntity(saveDto);

    const agent: User = await this.usersService.getActiveEntityById(
      saveDto.agentId,
    );

    if (agent.role !== Role.AGENT) {
      throw new RoleMismatchException(saveDto.agentId, Role.AGENT);
    }

    entity.agent = agent;
    entity.holder = await this.usersService.getActiveEntityById(
      saveDto.holderId,
    );

    entity.active = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActivePolicies(): Promise<PolicyDto[]> {
    const policies: Policy[] = await this.repository.findAllActive();

    if (policies.length === 0) {
      throw new EntityNotFoundException(Policy.name);
    }

    policies.forEach((p: Policy): void => this.excludeInactiveCars(p));
    return this.mapper.mapEntityListToDtoList(policies);
  }

  private excludeInactiveCars(policy: Policy): void {
    policy.cars = policy.cars.filter((c: Car): boolean => c.active);
  }

  async getActivePolicyById(id: number): Promise<PolicyDto> {
    const policy: Policy = await this.getActiveEntityById(id);
    this.excludeInactiveCars(policy);
    return this.mapper.mapEntityToDto(policy);
  }

  private async getActiveEntityById(id: number): Promise<Policy> {
    const policy: Policy | null = await this.repository.findById(id);

    if (!policy || !policy.active) {
      throw new EntityNotFoundException(Policy.name, id);
    }

    return policy;
  }

  async deleteById(id: number): Promise<void> {
    const policy: Policy = await this.getActiveEntityById(id);
    policy.active = false;
    await this.repository.save(policy);
  }

  async restoreById(id: number): Promise<void> {
    const policy: Policy | null = await this.repository.findById(id);

    if (!policy) {
      throw new EntityNotFoundException(Policy.name, id);
    }

    if (!policy.active) {
      policy.active = true;
      await this.repository.save(policy);
    }
  }

  async addActiveCarToActivePolicy(
    policyId: number,
    carId: number,
  ): Promise<void> {
    const policy: Policy = await this.getActiveEntityById(policyId);
    const car: Car = await this.carsService.getActiveEntityById(carId);

    if (policy.cars.some((x: Car): boolean => x.id === car.id)) {
      throw new EntityUpdateException(
        `Car id ${carId} is already present in the policy id ${policyId}`,
      );
    }

    policy.cars.push(car);
    await this.repository.save(policy);
  }
}
