import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendFriendRequestDto {
  @ApiProperty({
    example: 2,
    description: 'The ID of the user to whom the friend request is being sent',
  })
  @IsNumber()
  receiverId: number;
}
