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
import { StackToLanguage } from './stack-to-language.entity';
import { TrendStack } from './trend-stack.entity';

@Entity('techstack')
export class Techstack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @OneToMany(
    () => StackToLanguage,
    (stackToLanguage) => stackToLanguage.techstack,
  )
  stackToLanguages: StackToLanguage[];

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
