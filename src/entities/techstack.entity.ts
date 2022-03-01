import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language } from './language.entity';

@Entity()
export class Techstack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToMany(() => Language)
  @JoinTable()
  languages: Language[];

  @Column({ length: '255' })
  stackName: string;

  @Column({ type: 'bigint' })
  stackCode: bigint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
