import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches, Validate } from 'class-validator';
import { CarYearValidator } from '../validation/car-year.validator';

export class CarSaveDto {
  @ApiProperty()
  @Length(2, 20)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Brand should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  brand: string;

  @ApiProperty()
  @Length(1, 20)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Model should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  model: string;

  @ApiProperty()
  @Validate(CarYearValidator, {
    message: 'Car year should be between 1900 and the current year',
  })
  year: number;

  @ApiProperty()
  @Matches(/^[A-Z\d]{17}$/, {
    message:
      'VIN code should be exactly 17 symbols and it should contain only Latin capital letters and digits',
  })
  vin: string;

  @ApiProperty()
  @Length(3, 20)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Color should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  color: string;
}
