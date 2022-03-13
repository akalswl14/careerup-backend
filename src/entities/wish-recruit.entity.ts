import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruit } from './recruit.entity';
import { User } from './user.entity';

@Entity()
export class WishRecruit {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.wishRecruits, { nullable: false })
  user: User;

  @ManyToOne(() => Recruit, (recruit) => recruit.wishRecruits, {
    nullable: false,
  })
  recruit: Recruit;

  @CreateDateColumn()
  createdAt: Date;
}
