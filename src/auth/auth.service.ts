import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TokensService } from './tokens.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  private readonly refreshStorage: Map<string, string> = new Map<
    string,
    string
  >();

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async getAuthenticatedUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user: User = await this.usersService.getConfirmedByEmail(username);
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async login(loginDto: LoginRequestDto): Promise<TokenResponseDto> {
    const user: User = await this.getAuthenticatedUser(
      loginDto.email,
      loginDto.password,
    );

    const accessToken: string = this.tokensService.generateAccessToken(user);
    const refreshToken: string = this.tokensService.generateRefreshToken(user);
    this.refreshStorage.set(user.email, refreshToken);

    const tokenDto: TokenResponseDto = new TokenResponseDto();
    tokenDto.accessToken = accessToken;
    tokenDto.refreshToken = refreshToken;

    return tokenDto;
  }

  async refreshAccessToken(cookies: string | undefined): Promise<string> {
    if (cookies === undefined) {
      throw new UnauthorizedException(
        'Request does not contain cookie with refresh token',
      );
    }

    const refreshToken: string | null = this.tokensService.getTokenFromCookies(
      cookies,
      'refresh-token',
    );

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Request does not contain cookie with refresh token',
      );
    }

    const email: string =
      this.tokensService.validateRefreshTokenAndGetEmail(refreshToken);

    const savedRefreshToken: string | undefined =
      this.refreshStorage.get(email);

    if (refreshToken !== savedRefreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const user: User = await this.usersService.getConfirmedByEmail(email);
    return this.tokensService.generateAccessToken(user);
  }

  revokeRefreshToken(cookies: string | undefined): void {
    if (cookies === undefined) {
      return;
    }

    const refreshToken: string | null = this.tokensService.getTokenFromCookies(
      cookies,
      'refresh-token',
    );

    if (!refreshToken) {
      return;
    }

    let email: string;
    try {
      email = this.tokensService.validateRefreshTokenAndGetEmail(refreshToken);
    } catch {
      return;
    }

    this.refreshStorage.delete(email);
  }
}
