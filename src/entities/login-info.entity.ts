import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LoginInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.loginInfoList, { nullable: false })
  user: User;

  @Column()
  loginSuccess: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
