import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => User, (user) => user.repositories, { nullable: false })
  user: User;

  @Column({ type: 'bigint' })
  gitRepoId: bigint;

  @Column({ length: '255' })
  repoName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
