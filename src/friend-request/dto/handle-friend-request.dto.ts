import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandleFriendRequestDto {
  @ApiProperty({
    example: 5,
    description: 'The ID of the user who sent the friend request',
  })
  @IsNumber()
  receiverId: number;
}
