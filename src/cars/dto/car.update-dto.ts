import { ApiProperty } from '@nestjs/swagger';

export class CarUpdateDto {
  @ApiProperty()
  newColor: string;
}
