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
import { Task } from './task.entity';
import { Techstack } from './techstack.entity';
import { WishRecruit } from './wish-recruit.entity';

@Entity()
export class Recruit {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToMany(() => WishRecruit, (wishRecruit) => wishRecruit.recruit)
  wishRecruits: WishRecruit[];

  @ManyToMany(() => Techstack)
  @JoinTable()
  techstacks: Techstack[];

  @ManyToMany(() => Task)
  @JoinTable()
  tasks: Task[];

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

  @Column({ type: 'int' })
  dueType: number;

  @Column({ type: 'bigint' })
  recruitCode: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
