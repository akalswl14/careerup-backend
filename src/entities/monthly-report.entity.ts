import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MonthlyReport {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.monthlyReportList, { nullable: false })
  user: User;

  @Column({ type: 'bigint' })
  repoIdList: number[];

  @Column({ nullable: true, default: 0 })
  commitNum: number;

  @Column({ nullable: true, default: 0 })
  momCommitNum: number;

  @Column({ type: 'json' })
  commitDetail: string;

  @Column({ nullable: true, default: 0 })
  starNum: number;

  @Column({ length: '255', nullable: true })
  mostStarRepo: string;

  @Column({ type: 'json' })
  languageDetail: string;

  @Column({ length: '255', nullable: true })
  stackName: string;

  @Column({ length: '255', nullable: true })
  stackLanguage: string;

  @Column({ length: '255', nullable: true })
  stackTask: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
