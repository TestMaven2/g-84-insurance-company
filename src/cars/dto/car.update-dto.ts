import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class CarUpdateDto {
  @ApiProperty()
  @Length(3, 20)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Color should contain only capital and small letters, spaces, dashes and apostrophes',
  })
  newColor: string;
}
