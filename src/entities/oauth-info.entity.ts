import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class OauthInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  oauthId: number;

  @ManyToOne(() => User, (user) => user.oauthInfoList)
  user: User;

  @Column({ length: '255' })
  accessToken: string;

  @Column({ length: '255' })
  provider: string;

  @CreateDateColumn()
  createdAt: Date;
}
