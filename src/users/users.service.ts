import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Role } from './enums/role.enum';
import { UserDto } from './dto/user.dto';
import { UsersMapper } from './dto/users.mapper';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    private readonly repository: UsersRepository,
    private readonly mapper: UsersMapper,
    // private readonly validator: UsersValidator,
  ) {}

  async create(saveDto: UserSaveDto): Promise<UserDto> {
    if (await this.repository.isEmailExists(saveDto.email)) {
      throw new EntitySaveException(User.name, 'email');
    }

    // this.validator.validateSaveDto(saveDto);
    const entity: User = this.mapper.mapDtoToEntity(saveDto);
    entity.role = Role.CUSTOMER;
    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(`User created: id ${entity.id}, email ${entity.email}`);

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveUsers(): Promise<UserDto[]> {
    const users: User[] = await this.repository.findAllActive();

    if (users.length === 0) {
      throw new EntityNotFoundException(User.name);
    }

    return this.mapper.mapEntityListToDtoList(users);
  }

  async getActiveUserById(id: number): Promise<UserDto> {
    const user: User = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(user);
  }

  async getActiveEntityById(id: number): Promise<User> {
    const user: User | null = await this.repository.findById(id);

    if (!user || !user.active) {
      throw new EntityNotFoundException(User.name, id);
    }

    return user;
  }

  async update(id: number, updateDto: UserUpdateDto): Promise<void> {
    // this.validator.validateUpdateDto(updateDto);
    const foundUser: User | null = await this.repository.findById(id);

    if (foundUser) {
      foundUser.name = updateDto.newName;
      await this.repository.save(foundUser);

      this.logger.log(`User updated: id ${id}, new name ${foundUser.name}`);
    } else {
      throw new EntityNotFoundException(User.name, id);
    }
  }

  async deleteById(id: number): Promise<void> {
    const user: User = await this.getActiveEntityById(id);
    user.active = false;
    await this.repository.save(user);

    this.logger.log(`User marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const user: User | null = await this.repository.findById(id);

    if (!user) {
      throw new EntityNotFoundException(User.name);
    }

    if (!user.active) {
      user.active = true;
      await this.repository.save(user);

      this.logger.log(`User marked as active: id ${id}`);
    }
  }

  async setRole(id: number, role: Role): Promise<void> {
    const user: User = await this.getActiveEntityById(id);

    if (user.role === role) {
      throw new EntityUpdateException(`User id ${id} already has role ${role}`);
    }

    user.role = role;
    await this.repository.save(user);

    this.logger.log(`User updated: ${id}, new role ${role}`);
  }
}
