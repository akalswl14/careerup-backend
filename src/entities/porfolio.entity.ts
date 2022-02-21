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
export class Portfolio {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  portfolioId: number;

  @ManyToOne(() => User, (user) => user.portfolioList)
  user: User;

  @Column({ length: '255' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
