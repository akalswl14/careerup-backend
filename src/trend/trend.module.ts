import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackToStack } from 'src/entities/stack-to-stack.entity';
import { TaskToStack } from 'src/entities/task-to-stack.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Techstack, StackToStack, TaskToStack]),
  ],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
