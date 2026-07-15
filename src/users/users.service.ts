import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Role } from './enums/role.enum';
import { UserDto } from './dto/user.dto';
import { UsersMapper } from './dto/users.mapper';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async create(saveDto: UserSaveDto): Promise<UserDto> {
    const entity: User = this.mapper.mapDtoToEntity(saveDto);
    entity.role = Role.CUSTOMER;
    entity.active = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveUsers(): Promise<UserDto[]> {
    const users: User[] = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(users);
  }

  async getActiveUserById(id: number): Promise<UserDto> {
    const user: User = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(user);
  }

  async getActiveEntityById(id: number): Promise<User> {
    const user: User | null = await this.repository.findById(id);

    if (!user || !user.active) {
      throw Error();
    }

    return user;
  }

  async update(id: number, updateDto: UserUpdateDto): Promise<void> {
    const foundUser: User | null = await this.repository.findById(id);

    if (foundUser) {
      foundUser.name = updateDto.newName;
      await this.repository.save(foundUser);
    }
  }

  async deleteById(id: number): Promise<void> {
    const user: User = await this.getActiveEntityById(id);
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
    const user: User = await this.getActiveEntityById(id);
    user.role = role;
    await this.repository.save(user);
  }
}
