import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../src/users/users.module';
import { UserSaveDto } from '../../src/users/dto/user.save-dto';
import request from 'supertest';
import { Role } from '../../src/users/enums/role.enum';
import { UserUpdateDto } from '../../src/users/dto/user.update-dto';

describe('UsersController (IT)', (): void => {
  const RESOURCE_NAME: string = '/users';

  const VALID_SAVE_DTO: UserSaveDto = {
    email: 'user@test.com',
    password: 'TestUserPass1',
    name: 'User Name',
  };

  const VALID_SAVE_DTO_WITH_INCORRECT_EMAIL: UserSaveDto = {
    email: 'usertest.com',
    password: 'TestUserPass1',
    name: 'User Name',
  };

  const VALID_UPDATE_DTO: UserUpdateDto = {
    newName: 'New User Name',
  };

  const UPDATE_DTO_WITH_INCORRECT_NAME: UserUpdateDto = {
    newName: 'New Us#er Name',
  };

  let app: INestApplication;
  let httpServer: any;
  let repository: Repository<User>;

  let activeUser: User;
  let inactiveUser: User;

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'qwerty123',
          database: 'g_84_insurance_company_test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    httpServer = app.getHttpServer();
    repository = module.get(getRepositoryToken(User));
  });

  beforeEach(async (): Promise<void> => {
    activeUser = new User();
    activeUser.email = 'active@test.com';
    activeUser.password = 'ActiveUserPass1';
    activeUser.name = 'Active User Name';
    activeUser.role = Role.CUSTOMER;
    activeUser.active = true;

    inactiveUser = new User();
    inactiveUser.email = 'inactive@test.com';
    inactiveUser.password = 'InactiveUserPass1';
    inactiveUser.name = 'Inactive User Name';
    inactiveUser.role = Role.CUSTOMER;
    inactiveUser.active = false;

    await repository.save([activeUser, inactiveUser]);
  });

  afterEach(async (): Promise<void> => {
    await repository.deleteAll();
  });

  afterAll(async (): Promise<void> => {
    await app.close();
  });

  describe('create', (): void => {
    it('should create user', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(RESOURCE_NAME)
        .send(VALID_SAVE_DTO)
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
      expect(response.body.password).toBeUndefined();
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: VALID_SAVE_DTO.name,
          role: Role.CUSTOMER,
        }),
      );

      const savedUser: User | null = await repository.findOneBy({
        id: response.body.id,
      });

      expect(savedUser).toBeDefined();
      expect(savedUser).toEqual(
        expect.objectContaining({
          email: VALID_SAVE_DTO.email,
          // В реальном приложении пароль, сохранённый в БД не будет соответствовать
          // паролю в ДТО. Потому что в БД пароль зашифрованный, а в ДТО - в сыром виде.
          // Но в качестве учебного примера оставим, т.к. в нашем случае пока
          // пароль в ДТО полностью соответствует паролю в БД.
          password: VALID_SAVE_DTO.password,
          name: VALID_SAVE_DTO.name,
          role: Role.CUSTOMER,
          active: true,
        }),
      );
    });

    it('should return 400 if email is incorrect', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(RESOURCE_NAME)
        .send(VALID_SAVE_DTO_WITH_INCORRECT_EMAIL)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('email')]),
      );
    });
  });

  describe('getById', (): void => {
    it('should return user', async (): Promise<void> => {
      // /users/5
      const response: Response = await request(httpServer)
        .get(`${RESOURCE_NAME}/${activeUser.id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.password).toBeUndefined();
      expect(response.body).toEqual(
        expect.objectContaining({
          id: activeUser.id,
          name: activeUser.name,
          role: activeUser.role,
        }),
      );
    });

    it('should return 404 if inactive user is requested', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .get(`${RESOURCE_NAME}/${inactiveUser.id}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toContain('not found');
    });
  });

  describe('update', (): void => {
    it('should update user name', async (): Promise<void> => {
      await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}`)
        .send(VALID_UPDATE_DTO)
        .expect(HttpStatus.NO_CONTENT);

      const updatedUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser).toEqual(
        expect.objectContaining({
          email: activeUser.email,
          password: activeUser.password,
          name: VALID_UPDATE_DTO.newName,
          role: Role.CUSTOMER,
          active: true,
        }),
      );
    });

    it('should return 400 if new user name is incorrect', async (): Promise<void> => {
      const response = await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}`)
        .send(UPDATE_DTO_WITH_INCORRECT_NAME)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('Name')]),
      );

      const existingUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(existingUser).toBeDefined();
      expect(existingUser).toEqual(
        expect.objectContaining({
          email: activeUser.email,
          password: activeUser.password,
          name: activeUser.name,
          role: Role.CUSTOMER,
          active: true,
        }),
      );
    });
  });
});
