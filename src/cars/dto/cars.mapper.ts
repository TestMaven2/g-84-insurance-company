import { Injectable } from '@nestjs/common';
import { CarSaveDto } from './car.save-dto';
import { Car } from '../car.entity';
import { CarDto } from './car.dto';
import { UsersMapper } from '../../users/dto/users.mapper';

@Injectable()
export class CarsMapper {
  constructor(private readonly usersMapper: UsersMapper) {}

  mapDtoToEntity(saveDto: CarSaveDto): Car {
    const entity: Car = new Car();
    entity.brand = saveDto.brand;
    entity.model = saveDto.model;
    entity.year = saveDto.year;
    entity.vin = saveDto.vin;
    entity.color = saveDto.color;
    return entity;
  }

  mapEntityToDto(entity: Car): CarDto {
    const dto: CarDto = new CarDto();
    dto.id = entity.id;
    dto.brand = entity.brand;
    dto.model = entity.model;
    dto.year = entity.year;
    dto.vin = entity.vin;
    dto.color = entity.color;
    dto.owner = this.usersMapper.mapEntityToDto(entity.owner);
    return dto;
  }

  mapEntityListToDtoList(entityList: Car[]): CarDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Car): CarDto => this.mapEntityToDto(x));
  }
}
