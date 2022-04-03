import { IsBoolean, IsInt, IsNumberString, IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class setWishTaskDto {
  @IsNumberString()
  id: string;

  @IsNumberString()
  priority: string;
}

@Entity()
export class wishTaskOptionDto {
  @IsNumberString()
  id: string;

  @IsString()
  taskName: string;

  @IsBoolean()
  isWish: boolean;
}

@Entity()
export class userWishTaskDto {
  @IsNumberString()
  id: string;

  @IsString()
  taskName: string;

  @IsInt()
  priority: number;
}
