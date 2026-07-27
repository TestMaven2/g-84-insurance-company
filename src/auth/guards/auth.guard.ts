import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../types/auth.decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request: any = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Invalid auth header');
    }

    const encodedCredentials: string = authHeader.split(' ')[1];

    // user@test.com:qwerty123
    const credentials: string = Buffer.from(
      encodedCredentials,
      'base64',
    ).toString('utf-8');

    const [username, password]: string[] = credentials.split(':');

    request.user = await this.authService.getAuthenticatedUser(
      username,
      password,
    );

    return true;
  }
}
