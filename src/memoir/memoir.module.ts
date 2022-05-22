import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memoir } from 'src/entities/memoir.entity';
import { MonthlyReport } from 'src/entities/monthly-report.entity';
import { MemoirController } from './memoir.controller';
import { MemoirService } from './memoir.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([MonthlyReport, Memoir])],
  controllers: [MemoirController],
  providers: [MemoirService],
})
export class MemoirModule {}
