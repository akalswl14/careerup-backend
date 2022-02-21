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
  oauthId: number;

  @Column({ length: '255' })
  accessToken: string;

  @ManyToOne(() => User, (user) => user.loginInfoList)
  user: User;

  @CreateDateColumn({})
  createdAt: Date;
}
