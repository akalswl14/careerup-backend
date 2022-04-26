import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('LoginInfo')
export class LoginInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.loginInfos, { nullable: false })
  user: User;

  @Column()
  loginSuccess: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
