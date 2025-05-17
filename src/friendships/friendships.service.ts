import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Friend } from './interface/friend.interface';


@Injectable()
export class FriendshipsService {
  constructor(private readonly db: DatabaseService) {}

  async areUsersAlreadyFriends(userId: number, friendId: number): Promise<boolean> {
    const result = await this.db.query(
      `SELECT 1 FROM friendships WHERE user_id = $1 AND friend_id = $2`,
      [userId, friendId]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  async getFriends(userId: number): Promise<Friend[]> {
    const result = await this.db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email
       FROM friendships f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = $1`,
      [userId]
    );

    return result.rows;
  }
}
