import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StackToStack } from './stack-to-stack.entity';
import { TaskToStack } from './task-to-stack.entity';
import { TrendStack } from './trend-stack.entity';
import { WishTask } from './wish-task.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToMany(() => WishTask, (wishTask) => wishTask.task)
  wishTasks: WishTask[];

  @OneToMany(() => TaskToStack, (taskToStack) => taskToStack.task)
  taskToStacks: WishTask[];

  @OneToMany(() => StackToStack, (stackToStack) => stackToStack.task)
  stackToStacks: WishTask[];

  @OneToMany(() => TrendStack, (trendStack) => trendStack.task)
  trendStacks: TrendStack[];

  @Column({ length: '255' })
  taskName: string;

  @Column({ type: 'bigint' })
  taskCode: string;

  @Column()
  isDuplicate: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
