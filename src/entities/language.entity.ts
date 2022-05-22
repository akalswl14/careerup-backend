import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StackToLanguage } from './stack-to-language.entity';

@Entity('language')
export class Language {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToMany(
    () => StackToLanguage,
    (stackToLanguage) => stackToLanguage.language,
  )
  stackToLanguages: StackToLanguage[];

  @Column({ length: '255' })
  languageName: string;

  @Column({ type: 'bigint' })
  languageCode: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
