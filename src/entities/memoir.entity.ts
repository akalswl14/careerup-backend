import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { MonthlyReport } from './monthly-report.entity';
import { User } from './user.entity';

@Entity('memoir')
export class Memoir {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToOne(() => MonthlyReport, { nullable: true })
  @JoinColumn()
  monthlyReport: MonthlyReport;

  @ManyToOne(() => User, (user) => user.memoirs, { nullable: false })
  user: User;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
