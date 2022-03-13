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
  id: string;

  @ManyToOne(() => User, (user) => user.loginInfos, { nullable: false })
  user: User;

  @Column()
  loginSuccess: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
