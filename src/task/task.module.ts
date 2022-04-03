import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User, Task, WishTask])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
