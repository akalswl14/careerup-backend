import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsString } from 'class-validator';
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
