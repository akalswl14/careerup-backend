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
import { MonthlyReport } from './monthly-report.entity';
import { WishRecruit } from './wish-recruit.entity';
import { WishTask } from './wish-task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  gitUserId: string;

  @Column({ type: 'varchar', nullable: true })
  userAccessToken: string;

  @Column({ length: '40' })
  username: string;

  @Column({ length: '255', nullable: true })
  email: string;

  @Column({ length: '255' })
  profileUrl: string;

  @Column({ type: 'boolean', default: false })
  settingAppPush: boolean;

  @Column({ type: 'boolean', default: false })
  settingCoupon: boolean;

  @OneToMany(() => LoginInfo, (loginInfo) => loginInfo.user)
  loginInfos: LoginInfo[];

  @OneToMany(() => OauthInfo, (oauthInfo) => oauthInfo.user)
  oauthInfos: OauthInfo[];

  @OneToMany(() => School, (school) => school.user)
  schools: School[];

  @OneToMany(() => Career, (career) => career.user)
  careers: Career[];

  @OneToMany(() => PortfolioLog, (portfolioLog) => portfolioLog.user)
  portfolioLogs: PortfolioLog[];

  @OneToMany(() => ReportLog, (reportLog) => reportLog.user)
  reportLogs: ReportLog[];

  @OneToMany(() => Repository, (repository) => repository.user)
  repositories: Repository[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];

  @OneToMany(() => MonthlyReport, (monthlyReport) => monthlyReport.user)
  monthlyReports: MonthlyReport[];

  @OneToMany(() => WishRecruit, (wishRecruit) => wishRecruit.user)
  wishRecruits: WishRecruit[];

  @OneToMany(() => WishTask, (wishTask) => wishTask.user)
  wishTasks: WishTask[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
