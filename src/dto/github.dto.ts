import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ProcessStatus } from 'src/entities/enum';
import { MonthlyReport } from 'src/entities/monthly-report.entity';
import { Entity } from 'typeorm';
import { memoirThumbnail } from './memoir.dto';

@Entity()
export class repositoryDto {
  @IsNumber()
  @ApiProperty({
    description: 'github Repository ID. 서비스 DB 내의 Repository ID 아님.',
    required: true,
    nullable: true,
  })
  gitRepoId: number;

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

  @IsNumber()
  @IsArray()
  @ApiProperty({
    description: '사용된 Repository Git ID 들',
    required: true,
    isArray: true,
    type: 'bigint',
  })
  repoIds: string[];

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

@Entity()
export class languageToTaskDto {
  @IsNumberString()
  @ApiProperty({
    description: '(희망) 직무 Task ID',
    required: true,
    type: 'bigint',
  })
  taskId: string;

  @IsString()
  @ApiProperty({
    description: '(희망) 직무 Task 이름',
    required: true,
  })
  taskName: string;

  @IsNumberString()
  @ApiProperty({
    description: '해당 테크스택 TechStack ID',
    required: true,
    type: 'bigint',
  })
  techstackId: string;

  @IsString()
  @ApiProperty({
    description: '해당 테크스택 TechStack 이름',
    required: true,
  })
  techstackName: string;

  @IsNumberString()
  @ApiProperty({
    description: '해당 언어 Language ID',
    required: true,
    type: 'bigint',
  })
  languageId: string;

  @IsString()
  @ApiProperty({
    description: '해당 언어 Language 이름',
    required: true,
  })
  languageName: string;
}

export type monthlyReportContents = Omit<
  MonthlyReport,
  'user' | 'repoIds' | 'updatedAt'
>;

@Entity()
export class monthlyReportThumbnail {
  @IsEnum(ProcessStatus)
  @ApiProperty({
    description:
      '분석 결과 상태값. 이전에 생성된 분석 결과가 없는 경우 현재 분석 상태를 반환함\n만약 Repository를 선택하지 않아 요청된 상태가 아니거나, 이전 분석 결과가 있을 경우에는 null을 반환함.\nrequest : 분석 요청 / onprogress : 분석 중 / fail : 실패 / success : 분석 성공 및 결과 생성',
    required: true,
    nullable: true,
  })
  status: ProcessStatus;

  @ApiProperty({
    description: '분석 결과. 반환할 결과가 없을 경우 null',
    required: true,
    nullable: true,
  })
  contents: monthlyReportContents | null;

  @ApiProperty({
    description:
      '분석 결과에 연결된 월간회고록 Memoir. 반환할 결과가 없을 경우 null',
    required: true,
    nullable: true,
  })
  memoir: memoirThumbnail | null;
}
