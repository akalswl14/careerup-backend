import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class setWishTaskDto {
  @IsNumberString()
  @ApiProperty({ description: '희망 직무 Task ID', required: true })
  id: string;

  @IsNumberString()
  @ApiProperty({ description: '희망 직무 선택 순위', required: true })
  priority: string;
}

@Entity()
export class wishTaskOptionDto {
  @IsNumberString()
  @ApiProperty({ description: '직무 옵션 Task ID', required: true })
  id: string;

  @IsString()
  @ApiProperty({ description: '직무 옵션 Task 이름', required: true })
  taskName: string;

  @IsBoolean()
  @ApiProperty({ description: '해당 직무 옵션 찜 여부', required: true })
  isWish: boolean;
}

@Entity()
export class userWishTaskDto {
  @IsNumberString()
  @ApiProperty({ description: '희망 직무 Task ID', required: true })
  id: string;

  @IsString()
  @ApiProperty({ description: '희망 직무 Task 이름', required: true })
  taskName: string;

  @IsInt()
  @ApiProperty({ description: '희망 직무 선택 순위', required: true })
  priority: number;
}

export class priorityQueryDto {
  @IsNumberString()
  @ApiProperty({ description: '희망 직무 선택 순위', required: true })
  priority: string;
}
