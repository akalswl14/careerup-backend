import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProcessStatus } from './enum';
import { User } from './user.entity';

@Entity()
export class ReportLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  reportLogId: number;

  @ManyToOne(() => User, (user) => user.reportLogList)
  user: User;

  @Column({ type: 'enum', enum: ProcessStatus })
  reportStatus: ProcessStatus;

  @CreateDateColumn()
  createdAt: Date;
}
