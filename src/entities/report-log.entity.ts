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
  id: number;

  @ManyToOne(() => User, (user) => user.reportLogList, { nullable: false })
  user: User;

  @Column({ type: 'enum', enum: ProcessStatus })
  reportStatus: ProcessStatus;

  @CreateDateColumn()
  createdAt: Date;
}
