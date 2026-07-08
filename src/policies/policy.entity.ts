import { InsuranceType } from './enums/insurance-type.enum';
import { User } from '../users/user.entity';
import { Car } from '../cars/car.entity';

export class Policy {
  id: number;
  type: InsuranceType;
  holder: User;
  agent: User;
  cars: Car[];
  coverageInCents: number;
  issuedAt: Date;
  expiresAt: Date;
  active: boolean;
}
