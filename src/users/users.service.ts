import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/user.dto';
import { UserSearchQuery } from './dto/search-user.dto';
import { buildUserSearchQuery } from './utils/user-query.util';
import { User, UserWithoutPassword } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async createUser(data: CreateUserDto): Promise<UserWithoutPassword> {
    const { firstName, lastName, email, password, age } = data;

    const result = await this.db.query<UserWithoutPassword>(
      `
      INSERT INTO users (first_name, last_name, email, password, age)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, age
      `,
      [firstName, lastName, email, password, age || null],
    );

    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0] ?? null;
  }

  async searchUsers(query: UserSearchQuery): Promise<Omit<User, 'password'>[]> {
    const { whereClause, values } = buildUserSearchQuery(query);
    const queryText = `SELECT id, first_name, last_name, email, age FROM users ${whereClause}`;
    const result = await this.db.query(queryText, values);
    return result.rows;
  }
}
