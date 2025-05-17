import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSearchQuery } from './dto/search-user.dto';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto'; 
import { AuthGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Users') 
@ApiBearerAuth() 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('search')
  @ApiResponse({ status: 200, description: 'Found users', type: [UserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchUsers(@Query() query: UserSearchQuery) {
    return this.usersService.searchUsers(query);
  }
}
