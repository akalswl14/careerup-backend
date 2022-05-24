import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class memoirThumbnail {
  @IsNumberString()
  @ApiProperty({
    description: '월간 분석 결과에 해당하는 회고록 ID',
    required: true,
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: '회고록 내용',
    required: true,
    nullable: true,
  })
  description: string;

  @IsDate()
  @ApiProperty({
    description: '회고록 최종수정일',
    required: true,
  })
  updatedAt: Date;
}

@Entity()
export class inputMemoirDto {
  @IsNumberString()
  @ApiProperty({
    description:
      '월간 분석 결과 ID. \nMonthlyReport 페이지를 통해, 회고록을 최초 생성할 경우 ID가 없을 때에는 id property를 null 값으로 보내고, monthlyReport ID propperty는 not null로 전달해야함.',
    required: true,
    nullable: false,
  })
  monthlyReportId: string;

  @IsString()
  @ApiProperty({
    description: '등록할 회고록 내용',
    required: true,
    nullable: false,
  })
  description: string;
}
