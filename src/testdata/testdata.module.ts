import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruit } from 'src/entities/recruit.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { User } from 'src/entities/user.entity';
import { TestdataController } from './testdata.controller';
import { TestdataService } from './testdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recruit, Task, Techstack])],
  controllers: [TestdataController],
  providers: [TestdataService],
})
export class TestdataModule {}
