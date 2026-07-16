import { InsuranceType } from '../enums/insurance-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Min, Validate } from 'class-validator';
import { CoverageValidator } from '../validation/coverage.validator';
import { DatesValidator } from '../validation/dates.validator';
import { Type } from 'class-transformer';

export class PolicySaveDto {
  @ApiProperty({ enum: InsuranceType })
  type: InsuranceType;

  @ApiProperty()
  @Min(1)
  holderId: number;

  @ApiProperty()
  @Min(1)
  agentId: number;

  @ApiProperty()
  @Validate(CoverageValidator, {
    message:
      'Coverage should be equal or greater than 1000 for liability insurance and equal or greater than 1500 for casco insurance',
  })
  coverage: number;

  @ApiProperty()
  @Validate(DatesValidator, {
    message:
      'Issue date should not to be later than the current moment. Max insurance period is 3 years. Expiration date should not to be earlier than the issue date.',
  })
  @Type((): DateConstructor => Date)
  issuedAt: Date;

  @ApiProperty()
  @Type((): DateConstructor => Date)
  expiresAt: Date;
}
