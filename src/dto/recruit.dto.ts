import { IsBoolean, IsNumberString, IsString } from 'class-validator';
import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class recruitThumbnailDto {
  @IsNumberString()
  @ApiProperty({ description: '공고 ID' })
  id: string;

  @IsString()
  @ApiProperty({ description: '공고 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '공고 회사명' })
  companyName: string;

  @IsString()
  @ApiProperty({ description: '공고내 요구 조건. 예 ) 경력 2년↑' })
  career: string;

  @IsString()
  @ApiProperty({ description: '공고내 요구 학력. 예 ) 학력무관' })
  school: string;

  @IsBoolean()
  @ApiProperty({ description: '사용자의 찜 여부' })
  isWish: boolean;
}
