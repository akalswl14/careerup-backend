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
  id: bigint;

  @OneToMany(() => WishTask, (wishTask) => wishTask.task)
  wishTasks: WishTask[];

  @Column({ length: '255' })
  taskName: string;

  @Column({ type: 'bigint' })
  taskCode: bigint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
