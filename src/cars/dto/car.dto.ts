import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CarDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  vin: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  owner: UserDto;
}
