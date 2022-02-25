import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WishTask } from './wish-task.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  taskId: number;

  @OneToMany(() => WishTask, (wishTask) => wishTask.task)
  wishTasks: WishTask[];

  @Column({ length: '255' })
  taskName: string;

  @Column({ type: 'bigint' })
  taskCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
