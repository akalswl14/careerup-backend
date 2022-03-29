import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: '255' })
  languageName: string;

  @Column({ type: 'bigint' })
  languageCode: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
