import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('OauthInfo')
export class OauthInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.oauthInfos, { nullable: false })
  user: User;

  @Column({ length: '255' })
  accessToken: string;

  @Column({ length: '255' })
  provider: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
