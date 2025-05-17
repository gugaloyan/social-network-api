import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { UsersService } from '../users/users.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import * as bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import { AuthResponse } from './interfaces/auth-response.interface';
  
  const JWT_SECRET = process.env.JWT_SECRET as string;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const JWT_EXPIRES_IN = '7d' ;
  
  @Injectable()
  export class AuthService {
    constructor(private readonly usersService: UsersService) {}
  
    async register(dto: RegisterDto): Promise<AuthResponse> {
      try {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
  
        const user = await this.usersService.createUser({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hashedPassword,
        });
  
       
        const token = jwt.sign({ id: user.id,  email: user.email }, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: JWT_EXPIRES_IN,
          });
    
  
        return { token, user };
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Email already in use');
        }
        throw error;
      }
    }
  
    async login(dto: LoginDto): Promise<AuthResponse> {
      const user = await this.usersService.getUserByEmail(dto.email);
  
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
  

      const token = jwt.sign({ id: user.id,  email: user.email }, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRES_IN,
      });

      
      const { password, ...userWithoutPassword } = user;
  
      return {
        token,
        user: userWithoutPassword,
      };
    }
  }
  