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
  id: string;

  @ManyToOne(() => User, (user) => user.careers, { nullable: false })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column()
  careerStartDate: Date;

  @Column({ nullable: true })
  careerEndDate: Date;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
