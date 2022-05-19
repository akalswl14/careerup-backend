import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ProcessStatus } from 'src/entities/enum';
import { Entity } from 'typeorm';

@Entity()
export class repositoryDto {
  @IsNumberString()
  @ApiProperty({
    description: 'github Repository ID. 서비스 DB 내의 Repository ID 아님.',
    required: true,
    nullable: true,
  })
  gitRepoId: string;

  @IsString()
  @ApiProperty({ description: 'Repository 이름', required: true })
  repoName: string;
}

@Entity()
export class repositoryThumbnailDto extends repositoryDto {
  @IsString()
  @ApiProperty({ description: 'Repository URL', required: true })
  html_url: string;

  @IsBoolean()
  @ApiProperty({
    description: '유저의 해당 Repository 선택 여부',
    required: true,
  })
  isSelect: boolean;
}

@Entity()
export class reportLogDto {
  @IsNumberString()
  @ApiProperty({
    description:
      'MonthlyReport ID. 분석결과 ID. 실패된 경우 생성되지 않을 수 있어, nullable 함',
    required: true,
    nullable: true,
  })
  reportId: string | null;

  @IsNumberString()
  @ApiProperty({
    description: 'reportLog ID. 레포트 로그 ID.',
    required: true,
  })
  reportLogId: string;

  @IsEnum(ProcessStatus)
  @ApiProperty({
    description:
      '분석 결과 상태값. 요청된 reportLog가 유효하지 않아 비정상 처리될 경우, null',
    required: true,
    nullable: true,
  })
  reportStatus: ProcessStatus | null;

  @IsString()
  @IsArray()
  @ApiProperty({
    description: '사용된 Repository 이름',
    required: true,
    isArray: true,
  })
  repoNames: string[];

  @IsString()
  @ApiProperty({
    description: '기타 필요시 설명',
    required: true,
    nullable: true,
  })
  description: string | null;
}

@Entity()
export class requestRepoInputDto {
  @IsNumberString()
  @ApiProperty({
    description: 'reportLog ID. 레포트 로그 ID.',
    required: true,
  })
  reportLogId: string;

  @IsNumberString()
  @ApiProperty({
    description: 'User ID',
    required: true,
  })
  userId: string;

  @IsString()
  @ApiProperty({ description: 'User Github Username', required: true })
  username: string;

  @IsString()
  @ApiProperty({
    description: 'User Github Token issued by git.',
    required: true,
  })
  gitAccessToken: string;
}
