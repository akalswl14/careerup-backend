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
  id: string;

  @ManyToMany(() => Language)
  @JoinTable()
  languages: Language[];

  @Column({ length: '255' })
  stackName: string;

  @Column({ type: 'bigint' })
  stackCode: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
