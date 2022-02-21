import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Career {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  careerId: number;

  @ManyToOne(() => User, (user) => user.careerList)
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column()
  careerStartDate: Date;

  @Column()
  careerEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
