import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import jwt, { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class TokensService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
    this.refreshSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  generateAccessToken(user: User): string {
    return jwt.sign({ email: user.email }, this.accessSecret, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(user: User): string {
    return jwt.sign({ email: user.email }, this.refreshSecret, {
      expiresIn: '12h',
    });
  }

  private validateTokenAndGetEmail(token: string, secret: string): string {
    const payload: string | JwtPayload = jwt.verify(token, secret);
    if (
      payload !== null &&
      typeof payload === 'object' &&
      'email' in payload &&
      typeof payload.email === 'string'
    ) {
      return payload.email;
    }
    throw new UnauthorizedException('Token is invalid');
  }

  validateAccessTokenAndGetEmail(accessToken: string): string {
    return this.validateTokenAndGetEmail(accessToken, this.accessSecret);
  }

  validateRefreshTokenAndGetEmail(refreshToken: string): string {
    return this.validateTokenAndGetEmail(refreshToken, this.refreshSecret);
  }
}
