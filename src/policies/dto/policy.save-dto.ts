import { InsuranceType } from '../enums/insurance-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PolicySaveDto {
  @ApiProperty({ enum: InsuranceType })
  type: InsuranceType;

  @ApiProperty()
  holderId: number;

  @ApiProperty()
  agentId: number;

  @ApiProperty()
  coverage: number;

  @ApiProperty()
  issuedAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
