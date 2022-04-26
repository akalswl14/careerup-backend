import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language } from './language.entity';
import { TrendStack } from './trend-stack.entity';

@Entity('TechStack')
export class Techstack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToMany(() => Language)
  @JoinTable()
  languages: Language[];

  @OneToMany(() => TrendStack, (trendStack) => trendStack.techstack)
  trendStacks: TrendStack[];

  @Column({ length: '255' })
  stackName: string;

  @Column({ type: 'bigint' })
  stackCode: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
