import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { MonthlyReport } from './monthly-report.entity';

@Entity('memoir')
export class Memoir {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToOne(() => MonthlyReport, { nullable: true })
  @JoinColumn()
  monthlyReport: MonthlyReport;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
