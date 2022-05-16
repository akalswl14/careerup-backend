import { IsBoolean, IsNumber, IsNumberString, IsString } from 'class-validator';
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

@Entity()
export class searchRecruitQueryDto {
  @IsNumber()
  @ApiProperty({ description: '페이지네이션을 위한 take 값', required: false })
  take: number;

  @IsNumber()
  @ApiProperty({ description: '페이지네이션을 위한 page 값', required: false })
  page: number;

  @IsNumber()
  @ApiProperty({
    description: '검색 키워드 종류. Task = 0, Techstack = 1',
    required: false,
  })
  type: number;

  @IsNumberString()
  @ApiProperty({ description: '검색 키워드', required: true })
  keyword: string;

  @IsNumber()
  @ApiProperty({
    description: '정렬 기준. 최신순 = 0, 마감임박순 = 1',
    required: false,
  })
  order: number;
}
