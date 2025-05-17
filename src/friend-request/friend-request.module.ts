import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { DatabaseService } from '../database/database.service';
import { FriendshipsService } from 'src/friendships/friendships.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [ AuthModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, DatabaseService, FriendshipsService],
})
export class FriendRequestModule {}
