import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class userLoginDto {
  @IsString()
  @ApiProperty({ description: '유저 서비스 토큰', required: true })
  accessToken: string;

  @IsBoolean()
  @ApiProperty({
    description: '신규 유저의 여부. 신규 유저 : True, 기존 유저 : False',
    required: true,
  })
  isNewUser: boolean;
}
