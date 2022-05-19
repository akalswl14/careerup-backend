import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessStatus } from './enum';
import { User } from './user.entity';

@Entity('report_log')
export class ReportLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.reportLogs, { nullable: false })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: ProcessStatus })
  reportStatus: ProcessStatus;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
