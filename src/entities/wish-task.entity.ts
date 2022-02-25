import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class WishTask {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.wishTasks, { nullable: false })
  user: User;

  @ManyToOne(() => Task, (task) => task.wishTasks, { nullable: false })
  task: Task;

  @Column()
  priority: number;

  @CreateDateColumn()
  createdAt: Date;
}
