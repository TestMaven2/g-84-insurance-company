import { User } from '../users/user.entity';

export class Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  owner: User;
  active: boolean;
}
