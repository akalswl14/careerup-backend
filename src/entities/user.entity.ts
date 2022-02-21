import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OauthInfo } from './\boauth-info.entity';
import { LoginInfo } from './login-info.entity';
import { School } from './school.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  userId: number;

  @Column({ type: 'bigint' })
  gitUserId: number;

  @Column({ length: '15' })
  username: string;

  @Column({ length: '255' })
  email: string;

  @Column({ length: '255' })
  profileUrl: string;

  @Column({ type: 'boolean', default: false })
  settingAppPush: boolean;

  @Column({ type: 'boolean', default: false })
  settingCoupon: boolean;

  @OneToMany(() => LoginInfo, (loginInfo) => loginInfo.user)
  loginInfoList: LoginInfo[];

  @OneToMany(() => OauthInfo, (oauthInfo) => oauthInfo.user)
  oauthInfoList: OauthInfo[];

  @OneToMany(() => School, (school) => school.user)
  schoolList: School[];

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn({})
  updatedAt: Date;
}
