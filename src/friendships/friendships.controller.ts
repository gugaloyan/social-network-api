import {
    Controller,
    Get,
    UseGuards,
    Req,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { FriendshipsService } from './friendships.service';

  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/jwt/jwt.guard';
import { AuthRequest } from 'src/auth/interfaces/auth-request.interface';
  
  @ApiTags('Friendships')
  @ApiBearerAuth()
  @Controller('friendships')
  @UseGuards(AuthGuard)
  export class FriendshipsController {
    constructor(private readonly friendshipsService: FriendshipsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get friends list of current user' })
    @ApiResponse({ status: 200, description: 'Friends list returned successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch friends' })
    async getFriends(@Req() req: AuthRequest) {
      const userId = req.user!.id;
  
      try {
        const friends = await this.friendshipsService.getFriends(userId);
        return friends;
      } catch (error) {
        throw new HttpException('Failed to fetch friends', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  