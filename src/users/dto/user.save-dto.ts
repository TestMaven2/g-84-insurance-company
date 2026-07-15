import { ApiProperty } from '@nestjs/swagger';

export class UserSaveDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;
}
