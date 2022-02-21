import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OauthInfo } from './oauth-info.entity';
import { Career } from './career.entity';
import { LoginInfo } from './login-info.entity';
import { School } from './school.entity';
import { PortfolioLog } from './portfolio-log.entity';
import { ReportLog } from './report-log.entity';
import { Repository } from './repository.entity';
import { Portfolio } from './porfolio.entity';

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

  @OneToMany(() => Career, (career) => career.user)
  careerList: Career[];

  @OneToMany(() => PortfolioLog, (portfolioLog) => portfolioLog.user)
  portfolioLogList: PortfolioLog[];

  @OneToMany(() => ReportLog, (reportLog) => reportLog.user)
  reportLogList: ReportLog[];

  @OneToMany(() => Repository, (repository) => repository.user)
  repositoryList: Repository[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolioList: Portfolio[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
