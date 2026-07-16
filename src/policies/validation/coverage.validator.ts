import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PolicySaveDto } from '../dto/policy.save-dto';
import { InsuranceType } from '../enums/insurance-type.enum';

@ValidatorConstraint({
  name: 'isValidCoverage',
})
export class CoverageValidator implements ValidatorConstraintInterface {
  validate(coverage: number, args: ValidationArguments): boolean {
    const dto: PolicySaveDto = args.object as PolicySaveDto;

    if (dto.type == InsuranceType.LIABILITY) {
      return coverage >= 1000;
    }

    if (dto.type == InsuranceType.CASCO) {
      return coverage >= 1500;
    }

    return false;
  }
}
