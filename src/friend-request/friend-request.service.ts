import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FriendPendingResponse, FriendRequest } from './interfaces/friend-request-response.interface';
import { FriendshipsService } from 'src/friendships/friendships.service';
import {
    BadRequestException,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  


@Injectable()
export class FriendRequestService {
  constructor(
    private readonly db: DatabaseService,
    private readonly friendshipService: FriendshipsService,
  ) {}

  async sendFriendRequest(
    requesterId: number,
    receiverId: number,
  ): Promise<FriendRequest> {
    if (requesterId === receiverId) {
      throw new BadRequestException('You cannot send a request to yourself.');
    }
  
    const userResult = await this.db.query(
      `SELECT id FROM users WHERE id = $1`,
      [receiverId],
    );
  
    if (userResult.rows.length === 0) {
      throw new NotFoundException(`User with ID ${receiverId} not found.`);
    }
  
    const existingRequest = await this.db.query(
      `SELECT * FROM friend_requests 
       WHERE requester_id = $1 AND receiver_id = $2 AND status = 'pending'`,
      [requesterId, receiverId],
    );
  
    if (existingRequest.rows.length > 0) {
      throw new ConflictException('Friend request already sent.');
    }
  
    const alreadyFriends = await this.friendshipService.areUsersAlreadyFriends(
      requesterId,
      receiverId,
    );
  
    if (alreadyFriends) {
      throw new ConflictException('You are already friends.');
    }
  
    const result = await this.db.query(
      `INSERT INTO friend_requests (requester_id, receiver_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, requester_id, receiver_id, status, created_at`,
      [requesterId, receiverId],
    );
  
    return result.rows[0];
  }
  

  async acceptRequest(
    requesterId: number,
    receiverId: number,
  ): Promise<boolean> {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE friend_requests
         SET status = 'accepted'
         WHERE requester_id = $1 AND receiver_id = $2 AND status = 'pending'`,
        [requesterId, receiverId],
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      await client.query(
        `INSERT INTO friendships (user_id, friend_id)
         VALUES ($1, $2), ($2, $1)`,
        [requesterId, receiverId],
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async declineRequest(
    requesterId: number,
    receiverId: number,
  ): Promise<boolean> {
    const result = await this.db.query(
      `UPDATE friend_requests
       SET status = 'declined'
       WHERE requester_id = $1 AND receiver_id = $2 AND status = 'pending'`,
      [requesterId, receiverId],
    );

    return (result.rowCount ?? 0) > 0;
  }

  async getPendingFriendRequests(
    userId: number,
  ): Promise<FriendPendingResponse[]> {
    const result = await this.db.query(
      `SELECT fr.id, fr.status, fr.requester_id, u.first_name, u.last_name, u.age, u.email
       FROM friend_requests fr
       JOIN users u ON fr.requester_id = u.id
       WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
      [userId],
    );

    return result.rows;
  }
}
