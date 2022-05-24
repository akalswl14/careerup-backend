import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Techstack } from './techstack.entity';
import { Language } from './language.entity';

@Entity('stack_to_language')
export class StackToLanguage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Techstack, (techstack) => techstack.stackToLanguages, {
    nullable: false,
  })
  techstack: Techstack;

  @ManyToOne(() => Language, (language) => language.stackToLanguages, {
    nullable: false,
  })
  language: Language;

  @Column()
  techstackId: string;

  @Column()
  languageId: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
