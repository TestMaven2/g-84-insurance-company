import { UsersMapper } from '../../users/dto/users.mapper';
import { CarsMapper } from '../../cars/dto/cars.mapper';
import { PolicySaveDto } from './policy.save-dto';
import { Policy } from '../policy.entity';
import { PolicyDto } from './policy.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesMapper {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly carsMapper: CarsMapper,
  ) {}

  mapDtoToEntity(saveDto: PolicySaveDto): Policy {
    const entity: Policy = new Policy();
    entity.type = saveDto.type;
    entity.coverageInCents = saveDto.coverage * 100;
    entity.issuedAt = saveDto.issuedAt;
    entity.expiresAt = saveDto.expiresAt;
    return entity;
  }

  mapEntityToDto(entity: Policy): PolicyDto {
    const dto: PolicyDto = new PolicyDto();
    dto.id = entity.id;
    dto.type = entity.type;
    dto.holder = this.usersMapper.mapEntityToDto(entity.holder);
    dto.agent = this.usersMapper.mapEntityToDto(entity.agent);
    dto.cars = this.carsMapper.mapEntityListToDtoList(entity.cars);
    dto.coverage = entity.coverageInCents / 100;
    dto.issuedAt = entity.issuedAt;
    dto.expiresAt = entity.expiresAt;
    return dto;
  }

  mapEntityListToDtoList(entityList: Policy[]): PolicyDto[] {
    return entityList.map((x: Policy): PolicyDto => this.mapEntityToDto(x));
  }
}
