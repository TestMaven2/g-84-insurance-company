import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
