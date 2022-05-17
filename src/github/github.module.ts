import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'src/entities/repository.entity';
import { User } from 'src/entities/user.entity';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    TypeOrmModule.forFeature([Repository, User]),
  ],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
