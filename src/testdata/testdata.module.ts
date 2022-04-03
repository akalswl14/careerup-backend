import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/entities/language.entity';
import { Recruit } from 'src/entities/recruit.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { TrendStack } from 'src/entities/trend-stack.entity';
import { User } from 'src/entities/user.entity';
import { TestdataController } from './testdata.controller';
import { TestdataService } from './testdata.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Recruit,
      Task,
      Techstack,
      Language,
      TrendStack,
    ]),
  ],
  controllers: [TestdataController],
  providers: [TestdataService],
})
export class TestdataModule {}
