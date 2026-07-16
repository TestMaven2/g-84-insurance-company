import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'isValidCarYear',
})
export class CarYearValidator implements ValidatorConstraintInterface {
  validate(year: number): boolean {
    return year >= 1900 && year <= new Date().getFullYear();
  }
}
