import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/user.dto';
import { UserSearchQuery } from './dto/search-user.dto';
import { buildUserSearchQuery } from './utils/user-query.util';
import { User, UserWithoutPassword } from './interfaces/user.interface';

jest.mock('./utils/user-query.util', () => ({
  buildUserSearchQuery: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let dbService: DatabaseService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DatabaseService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return user without password', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        age: 30,
      };

      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 30,
      };

      mockDbService.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(dbService.query).toHaveBeenCalledWith(
        `
      INSERT INTO users (first_name, last_name, email, password, age)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, age
      `,
        [
          createUserDto.firstName,
          createUserDto.lastName,
          createUserDto.email,
          createUserDto.password,
          createUserDto.age,
        ],
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
      const email = 'jane@example.com';
      const user = {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email,
        age: 25,
        password: 'hashedPassword',
      };

      mockDbService.query.mockResolvedValueOnce({ rows: [user] });

      const result = await service.getUserByEmail(email);

      expect(result).toEqual(user);
      expect(dbService.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );
    });

    it('should return null if user not found', async () => {
      mockDbService.query.mockResolvedValueOnce({ rows: [] });

      const result = await service.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('searchUsers', () => {
    it('should return list of users matching query', async () => {
      const query: UserSearchQuery = { firstName: 'Alex' };
      const mockSearchQuery = {
        whereClause: 'WHERE first_name ILIKE $1',
        values: ['%Alex%'],
      };
      const users = [
        {
          id: 3,
          first_name: 'Alex',
          last_name: 'Johnson',
          email: 'alex@example.com',
          age: 29,
        },
      ];

      (buildUserSearchQuery as jest.Mock).mockReturnValueOnce(mockSearchQuery);
      mockDbService.query.mockResolvedValueOnce({ rows: users });

      const result = await service.searchUsers(query);

      expect(result).toEqual(users);
      expect(buildUserSearchQuery).toHaveBeenCalledWith(query);
      expect(dbService.query).toHaveBeenCalledWith(
        'SELECT id, first_name, last_name, email, age FROM users WHERE first_name ILIKE $1',
        ['%Alex%'],
      );
    });
  });
});
