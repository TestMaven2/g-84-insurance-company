import { Injectable } from '@nestjs/common';
import { CarSaveDto } from '../dto/car.save-dto';
import { CarUpdateDto } from '../dto/car.update-dto';

@Injectable()
export class CarsValidator {
  validateSaveDto(saveDto: CarSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const brand: string = saveDto.brand.trim();
    if (!brand || brand.length < 2 || brand.length > 20) {
      throw Error();
    }

    const model: string = saveDto.model.trim();
    if (!model || model.length < 1 || model.length > 20) {
      throw Error();
    }

    const year: number = saveDto.year;
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      throw Error();
    }

    const vin: string = saveDto.vin.trim();
    if (!vin || vin.length !== 17) {
      throw Error();
    }

    const color: string = saveDto.color.trim();
    if (!color || color.length < 3 || color.length > 20) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: CarUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    const color: string = updateDto.newColor.trim();
    if (!color || color.length < 3 || color.length > 20) {
      throw Error();
    }
  }
}
