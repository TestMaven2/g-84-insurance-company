import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '../../users/enums/role.enum';

export class RoleMismatchException extends HttpException {
  constructor(id: number, role: Role) {
    super(`User with id ${id} is not ${role}`, HttpStatus.BAD_REQUEST);
  }
}
