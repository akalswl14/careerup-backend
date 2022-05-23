import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsNumberString, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class trendTaskDto {
  @IsNumberString()
  @ApiProperty({
    description: '해당 트렌드 직무 Task ID',
    required: true,
    nullable: false,
  })
  taskId: string;

  @IsString()
  @ApiProperty({
    description: '해당 트렌드 직무 Task 이름',
    required: true,
    nullable: false,
  })
  taskName: string;

  @IsNumber()
  @ApiProperty({
    description: '해당 트렌드 직무 별 공고 수',
    required: true,
    nullable: false,
  })
  recruitNum: number;
}

@Entity()
export class trendTaskToStackDto {
  @IsNumber()
  @ApiProperty({
    description: '해당 트렌드 직무의 연관 테크스택 Techstack ID',
    required: true,
    nullable: false,
  })
  stackId: number;

  @IsString()
  @ApiProperty({
    description: '해당 트렌드 직무의 연관 테크스택 Techstack 이름',
    required: true,
    nullable: false,
  })
  stackName: string;

  @IsNumber()
  @ApiProperty({
    description: '해당 트렌드 직무의 연관 테크스택 Techstack 연관도',
    required: true,
    nullable: false,
  })
  num: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description:
      '해당 트렌드 직무의, 연관 테크스택의 연관 테크스택 Techstack ID 리스트',
    required: true,
    nullable: false,
  })
  innerStacks: string[];
}
