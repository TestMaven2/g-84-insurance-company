import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PolicySaveDto } from '../dto/policy.save-dto';

@ValidatorConstraint({
  name: 'isValidDates',
})
export class DatesValidator implements ValidatorConstraintInterface {
  validate(issuedAt: Date, args: ValidationArguments): boolean {
    const dto: PolicySaveDto = args.object as PolicySaveDto;

    if (!issuedAt || issuedAt.getTime() > Date.now()) {
      return false;
    }

    const expiresAt: Date = dto.expiresAt;
    if (!expiresAt || expiresAt.getFullYear() - issuedAt.getFullYear() > 3) {
      return false;
    }

    return expiresAt.getTime() > issuedAt.getTime();
  }
}
