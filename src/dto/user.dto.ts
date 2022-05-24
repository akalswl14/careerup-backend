import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class userProfileDto {
  @IsNumberString()
  @ApiProperty({ description: '유저 ID.', required: true })
  id: string;

  @IsString()
  @ApiProperty({ description: '유저 닉네임.', required: true })
  username: string;

  @IsString()
  @ApiProperty({
    description: '유저 프로필 이미지 url',
    required: true,
  })
  profileUrl: string;

  @IsString()
  @ApiProperty({
    description: '유저 이메일. 없을 수 있음 ( nullable )',
    nullable: true,
    required: true,
  })
  email: string | null;
}
