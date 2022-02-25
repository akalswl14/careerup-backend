import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Techstack {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: '255' })
  stackName: string;

  @Column({ type: 'bigint' })
  stackCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
