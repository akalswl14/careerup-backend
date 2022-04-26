import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('StackToStack')
export class StackToStack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Task, (task) => task.stackToStacks, { nullable: false })
  task: Task;

  @Column()
  stack: string;

  @Column()
  innerStack: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
