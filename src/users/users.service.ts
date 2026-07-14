import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(user: User): Promise<User> {
    user.role = Role.CUSTOMER;
    user.active = true;
    return await this.repository.save(user);
  }

  async getAllActiveUsers(): Promise<User[]> {
    return await this.repository.findAllActive();
  }

  async getActiveUserById(id: number): Promise<User> {
    const user: User | null = await this.repository.findById(id);

    if (!user || !user.active) {
      throw Error();
    }

    return user;
  }

  async update(id: number, user: User): Promise<void> {
    const foundUser: User | null = await this.repository.findById(id);

    if (foundUser) {
      foundUser.name = user.name;
      await this.repository.save(foundUser);
    }
  }

  async deleteById(id: number): Promise<void> {
    const user: User = await this.getActiveUserById(id);
    user.active = false;
    await this.repository.save(user);
  }

  async restoreById(id: number): Promise<void> {
    const user: User | null = await this.repository.findById(id);

    if (user && !user.active) {
      user.active = true;
      await this.repository.save(user);
    }
  }

  async setRole(id: number, role: Role): Promise<void> {
    const user: User = await this.getActiveUserById(id);
    user.role = role;
    await this.repository.save(user);
  }
}
