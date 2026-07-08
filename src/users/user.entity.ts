import { Role } from './enum/role.enum';

export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: Role;
  active: boolean;
}
