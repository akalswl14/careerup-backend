import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
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

@Entity()
export class recruitDetailDto {
  @IsNumberString()
  @ApiProperty({ description: '공고 ID', required: true })
  id: string;

  @IsString()
  @ApiProperty({ description: '공고 제목', required: true })
  title: string;

  @IsString()
  @ApiProperty({ description: '공고 회사명', required: true })
  companyName: string;

  @IsArray()
  @ApiProperty({
    description: '공고 태그 ( Task, Techstack )',
    required: true,
    isArray: true,
  })
  recruitTag: tagThumbnailDto[];

  @IsString()
  @ApiProperty({
    description: '공고내 요구 조건. 예 ) 경력 2년↑',
    required: true,
  })
  career: string;

  @IsString()
  @ApiProperty({
    description: '공고내 요구 학력. 예 ) 학력무관',
    required: true,
  })
  school: string;

  @IsString()
  @ApiProperty({ description: '공고내 요구 조건. 예 ) 정규직', required: true })
  condition: string;

  @IsString()
  @ApiProperty({
    description: '공고내 근무 지역. 예 ) 서울시 구로구',
    required: true,
  })
  location: string;

  @IsDate()
  @ApiProperty({ description: '공고 마감일.', required: true, nullable: true })
  dueDate: Date;

  @IsNumber()
  @ApiProperty({
    description:
      '공고 마감 종류. 마감일 마감 = 0, 채용시 마감 = 1, 상시 채용 = 2',
    required: true,
  })
  dueType: number;

  @IsNumberString()
  @ApiProperty({
    description: '공고의 사람인 ID',
    required: true,
  })
  saraminUri: string;

  @IsBoolean()
  @ApiProperty({ description: '사용자의 찜 여부', required: true })
  isWish: boolean;
}

@Entity()
export class tagThumbnailDto {
  @IsNumberString()
  @ApiProperty({ description: '태그 ID. task/techstack ID', required: true })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: '태그 종류. Task = 0, Techstack = 1',
    required: true,
  })
  type: number;

  @IsString()
  @ApiProperty({ description: '태그 이름', required: true })
  tagName: string;
}

@Entity()
export class recruitIdDto {
  @IsNumberString()
  @ApiProperty({ description: '공고 ID' })
  id: string;
}
