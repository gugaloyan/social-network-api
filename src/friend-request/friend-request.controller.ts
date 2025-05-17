import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Req,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { FriendRequestService } from './friend-request.service';
  import { SendFriendRequestDto } from './dto/send-friend-request.dto';
  import { HandleFriendRequestDto } from './dto/handle-friend-request.dto';

  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/jwt/jwt.guard';
import { AuthRequest } from 'src/auth/interfaces/auth-request.interface';

  
  @ApiTags('Friend Requests')
  @ApiBearerAuth()
  @Controller('friend-requests')
  @UseGuards(AuthGuard)
  export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}
  
    @Post()
    @ApiOperation({ summary: 'Send a friend request' })
    @ApiResponse({ status: 201, description: 'Friend request sent successfully' })
    @ApiResponse({ status: 400, description: 'User IDs are required' })
    async sendRequest(
      @Req() req: AuthRequest,
      @Body() body: SendFriendRequestDto,
    ) {

        console.log("req.user?.id;",req.user)
        console.log("body",body)
        
      const requesterId = req.user?.id;
      const receiverId = body.receiverId;
  
      if (!requesterId || !receiverId) {
        throw new HttpException('User IDs are required', HttpStatus.BAD_REQUEST);
      }
  
      const request = await this.friendRequestService.sendFriendRequest(
        requesterId,
        receiverId,
      );
  
      return { message: 'Application sent', request };
    }
  
    @Post('/accept')
    @ApiOperation({ summary: 'Accept a friend request' })
    @ApiResponse({ status: 200, description: 'Friend request accepted' })
    @ApiResponse({ status: 404, description: 'Request not found or already processed' })
    async accept(@Req() req: AuthRequest, @Body() body: HandleFriendRequestDto) {
      const receiverId = req.user!.id;
      const requesterId = body.receiverId;
  
      const success = await this.friendRequestService.acceptRequest(
        requesterId,
        receiverId,
      );
  
      if (!success) {
        throw new HttpException(
          'Request not found or already processed',
          HttpStatus.NOT_FOUND,
        );
      }
  
      return { message: 'Friend request accepted and friendship created' };
    }
  
    @Post('/decline')
    @ApiOperation({ summary: 'Decline a friend request' })
    @ApiResponse({ status: 200, description: 'Friend request declined' })
    @ApiResponse({ status: 404, description: 'Request not found or already processed' })
    async decline(@Req() req: AuthRequest, @Body() body: HandleFriendRequestDto) {
      const receiverId = req.user!.id;
      const requesterId = body.receiverId;
  
      const success = await this.friendRequestService.declineRequest(
        requesterId,
        receiverId,
      );
  
      if (!success) {
        throw new HttpException(
          'Request not found or already processed',
          HttpStatus.NOT_FOUND,
        );
      }
  
      return { message: 'Friend request declined' };
    }
  
    @Get()
    @ApiOperation({ summary: 'Get pending friend requests' })
    @ApiResponse({ status: 200, description: 'List of pending requests returned' })
    async getPending(@Req() req: AuthRequest) {
      const userId = req.user!.id;
      return await this.friendRequestService.getPendingFriendRequests(userId);
    }
  }
  