import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersMapper } from './dto/users.mapper';
import { UserSaveDto } from './dto/user.save-dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { User } from './user.entity';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { UserUpdateDto } from './dto/user.update-dto';

describe('UsersService', (): void => {
  const VALID_SAVE_DTO: UserSaveDto = {
    email: 'user1@test.com',
    password: 'UserPass1',
    name: 'User1',
  };

  const VALID_SAVE_DTO_WITH_EXISTING_EMAIL: UserSaveDto = {
    email: 'admin@test.com',
    password: 'AdminPass1',
    name: 'Admin',
  };

  const VALID_ENTITY_TO_MOCK_RETURN_1: User = {
    id: 1,
    email: 'user1@test.com',
    password: 'UserPass1',
    name: 'User1',
    role: Role.CUSTOMER,
    active: true,
  };

  const VALID_ENTITY_TO_MOCK_RETURN_2: User = {
    id: 2,
    email: 'user2@test.com',
    password: 'UserPass2',
    name: 'User2',
    role: Role.CUSTOMER,
    active: true,
  };

  const VALID_UPDATE_DTO: UserUpdateDto = {
    newName: 'New User Name',
  };

  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersMapper,
        {
          provide: UsersRepository,
          useValue: {
            save: jest.fn(),
            findAllActive: jest.fn(),
            findById: jest.fn(),
            isEmailExists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UsersRepository);

    repository.isEmailExists.mockImplementation(
      async (email: string): Promise<boolean> => {
        return email === 'admin@test.com';
      },
    );

    repository.findAllActive.mockResolvedValue([
      VALID_ENTITY_TO_MOCK_RETURN_1,
      VALID_ENTITY_TO_MOCK_RETURN_2,
    ]);

    repository.save.mockImplementation(async (entity: User): Promise<User> => {
      if (entity.email === 'user1@test.com') {
        return VALID_ENTITY_TO_MOCK_RETURN_1;
      }

      throw Error('User save error');
    });

    repository.findById.mockImplementation(
      async (id: number): Promise<User | null> => {
        if (id === 1) {
          return VALID_ENTITY_TO_MOCK_RETURN_1;
        }

        if (id === 2) {
          return VALID_ENTITY_TO_MOCK_RETURN_2;
        }

        return null;
      },
    );
  });

  describe('create', (): void => {
    it('should create active user and return dto', async (): Promise<void> => {
      const result: UserDto = await service.create(VALID_SAVE_DTO);

      expect(result).toBeDefined();
      expect(result.name).toEqual(VALID_SAVE_DTO.name);
      expect(result.role).toEqual(Role.CUSTOMER);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: Role.CUSTOMER, active: true }),
      );
    });

    it('should throw error if email already exists', async (): Promise<void> => {
      const resultPromise: Promise<UserDto> = service.create(
        VALID_SAVE_DTO_WITH_EXISTING_EMAIL,
      );

      await expect(resultPromise).rejects.toThrow('already exists');
      await expect(resultPromise).rejects.toBeInstanceOf(EntitySaveException);
    });
  });

  describe('getAllActiveUsers', (): void => {
    it('should return list of user DTOs', async (): Promise<void> => {
      const result: UserDto[] = await service.getAllActiveUsers();

      expect(result).toBeDefined();
      expect(result.length).toEqual(2);

      const dto1: UserDto = result[0];
      expect(dto1).toBeDefined();
      expect(dto1.id).toEqual(VALID_ENTITY_TO_MOCK_RETURN_1.id);
      expect(dto1.name).toEqual(VALID_ENTITY_TO_MOCK_RETURN_1.name);
      expect(dto1.role).toEqual(VALID_ENTITY_TO_MOCK_RETURN_1.role);

      const dto2: UserDto = result[1];
      expect(dto2).toBeDefined();
      expect(dto2.id).toEqual(VALID_ENTITY_TO_MOCK_RETURN_2.id);
      expect(dto2.name).toEqual(VALID_ENTITY_TO_MOCK_RETURN_2.name);
      expect(dto2.role).toEqual(VALID_ENTITY_TO_MOCK_RETURN_2.role);
    });

    it('should throw error if list of users is empty', async (): Promise<void> => {
      repository.findAllActive.mockResolvedValue([]);
      const resultPromise: Promise<UserDto[]> = service.getAllActiveUsers();

      await expect(resultPromise).rejects.toThrow('not a single');
      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should update user name', async (): Promise<void> => {
      const idToUpdate: number = 1;
      await service.update(idToUpdate, VALID_UPDATE_DTO);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: idToUpdate,
          name: VALID_UPDATE_DTO.newName,
        }),
      );
    });

    it('should throw exception when user is not found', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.update(
        1000,
        VALID_UPDATE_DTO,
      );

      await expect(resultPromise).rejects.toThrow('not found');
      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });
});
