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
  loginId: number;

  @ManyToOne(() => User, (user) => user.loginInfoList)
  user: User;

  @Column()
  loginSuccess: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
