import { InsuranceType } from '../enums/insurance-type.enum';
import { UserDto } from '../../users/dto/user.dto';
import { CarDto } from '../../cars/dto/car.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PolicyDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: InsuranceType })
  type: InsuranceType;

  @ApiProperty()
  holder: UserDto;

  @ApiProperty()
  agent: UserDto;

  @ApiProperty({ type: [CarDto] })
  cars: CarDto[];

  @ApiProperty()
  coverage: number;

  @ApiProperty()
  issuedAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
