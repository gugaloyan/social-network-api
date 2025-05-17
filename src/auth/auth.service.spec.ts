import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    age: undefined
  };

  beforeEach(() => {
    usersService = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
    } as any;

    authService = new AuthService(usersService);
    process.env.JWT_SECRET = 'test-secret'; // mock JWT secret
  });

  describe('register', () => {
    it('should hash password, create user and return token and user', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usersService.createUser.mockResolvedValue({ ...mockUser });
      (jwt.sign as jest.Mock).mockReturnValue('test-token');

      const result = await authService.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: 'hashedPassword',
      });
      expect(result).toEqual({
        token: 'test-token',
        user: mockUser,
      });
    });

    it('should throw ConflictException if email is already in use', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const error = { code: '23505' };
      usersService.createUser.mockRejectedValue(error);

      await expect(authService.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should validate credentials and return token and user', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      usersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('login-token');

      const result = await authService.login(dto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({
        token: 'login-token',
        user: {
          id: mockUser.id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          age: undefined, // if age exists, include it
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'notfound@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'john@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
