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
export class School {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  schoolId: number;

  @ManyToOne(() => User, (user) => user.schoolList)
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column()
  schoolStartDate: Date;

  @Column()
  schoolEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
