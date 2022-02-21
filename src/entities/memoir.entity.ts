import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MonthlyReport } from './monthly-report.entity';

@Entity()
export class Memoir {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => MonthlyReport)
  @JoinColumn()
  monthlyReport: MonthlyReport;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
