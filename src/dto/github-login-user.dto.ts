import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GithubLoginInputDto {
  @IsEmail()
  email: string | null;

  profileUrl: string;

  @IsNotEmpty()
  gitUserId: number;

  @IsNotEmpty()
  username: string;
}

export class GithubLoginOutputDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  gitUserId: string;

  @IsNotEmpty()
  username: string;

  profileUrl: string;
}
