import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/entities/language.entity';
import { Memoir } from 'src/entities/memoir.entity';
import { MonthlyReport } from 'src/entities/monthly-report.entity';
import { OauthInfo } from 'src/entities/oauth-info.entity';
import { ReportLog } from 'src/entities/report-log.entity';
import { Repository } from 'src/entities/repository.entity';
import { StackToLanguage } from 'src/entities/stack-to-language.entity';
import { TrendStack } from 'src/entities/trend-stack.entity';
import { User } from 'src/entities/user.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    TypeOrmModule.forFeature([
      Repository,
      User,
      ReportLog,
      MonthlyReport,
      OauthInfo,
      WishTask,
      TrendStack,
      Language,
      StackToLanguage,
      Memoir,
    ]),
  ],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
