import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LoginInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  loginId: number;

  @Column()
  loginSuccess: boolean;

  @ManyToOne(() => User, (user) => user.loginInfoList)
  user: User;

  @CreateDateColumn({})
  createdAt: Date;
}
