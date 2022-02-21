import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WishRecruit } from './wish-recruit.entity';

@Entity()
export class Recruit {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => WishRecruit, (wishRecruit) => wishRecruit.recruit)
  wishRecruitList: WishRecruit[];

  @Column({ length: '255' })
  companyName: string;

  @Column({ length: '255' })
  recruitTitle: string;

  @Column({ length: '255', nullable: true })
  recruitCareer: string;

  @Column({ length: '255', nullable: true })
  recruitSchool: string;

  @Column({ length: '255', nullable: true })
  recruitCondition: string;

  @Column({ length: '255', nullable: true })
  recruitLocation: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'bit', length: '2' })
  dueType: number;

  @Column({ type: 'bigint' })
  recruitCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
