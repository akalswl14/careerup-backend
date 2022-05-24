import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CoreOutput {
  ok: boolean;
  error?: string;
}

export class searchOptionDto {
  @IsNumberString()
  @ApiProperty({
    description: '해당 옵션 ID. task/techstack ID',
    required: true,
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: '옵션 종류. Task = 0, Techstack = 1',
    required: true,
  })
  type: number;

  @IsNumberString()
  @ApiProperty({ description: '해당 옵션 이름', required: true })
  optionName: string;
}
