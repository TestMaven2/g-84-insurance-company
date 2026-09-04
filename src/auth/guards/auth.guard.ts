import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../types/auth.decorators';
import { TokensService } from '../tokens.service';
import { UsersService } from '../../users/users.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const accessToken: string | null = this.tokensService.getTokenFromCookies(
      request.headers.cookie,
      'access-token',
    );

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const email: string =
      this.tokensService.validateAccessTokenAndGetEmail(accessToken);
    request.user = await this.usersService.getConfirmedByEmail(email);

    return true;
  }
}
