import { Module } from '@nestjs/common';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { DatabaseService } from 'src/database/database.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/jwt/jwt.guard';

@Module({
  imports: [ AuthModule],
  controllers: [FriendshipsController],
  providers: [FriendshipsService, DatabaseService],
  exports:[FriendshipsService]
})
export class FriendshipsModule {}
