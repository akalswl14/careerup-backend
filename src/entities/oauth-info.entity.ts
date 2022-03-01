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
  id: bigint;

  @ManyToOne(() => User, (user) => user.oauthInfos, { nullable: false })
  user: User;

  @Column({ length: '255' })
  accessToken: string;

  @Column({ length: '255' })
  provider: string;

  @CreateDateColumn()
  createdAt: Date;
}
