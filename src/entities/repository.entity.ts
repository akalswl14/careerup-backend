import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export class Repository {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  repositoryId: number;

  @ManyToOne(() => User, (user) => user.repositoryList)
  user: User;

  @Column({ type: 'bigint' })
  gitRepoId: number;

  @Column({ length: '255' })
  repoName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
