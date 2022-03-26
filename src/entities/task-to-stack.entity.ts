import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskToStack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Task, (task) => task.taskToStacks, { nullable: false })
  task: Task;

  @Column()
  stack: string;

  @Column()
  num: number;

  @CreateDateColumn()
  createdAt: Date;
}
