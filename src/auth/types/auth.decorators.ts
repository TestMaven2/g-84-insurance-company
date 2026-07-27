import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '../../users/enums/role.enum';

export const IS_PUBLIC_KEY: string = 'isPublic';

export const Public: () => CustomDecorator = (): CustomDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY: string = 'roles';

export const Roles: (...roles: Role[]) => CustomDecorator = (
  ...roles: Role[]
): CustomDecorator => SetMetadata(ROLES_KEY, roles);

// @Public()
// method() {}

// @Roles(AGENT, ADMIN)
// method() {}
