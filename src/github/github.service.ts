import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import * as UserRepository from 'src/entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  reportLogDto,
  repositoryDto,
  repositoryThumbnailDto,
  requestRepoInputDto,
} from 'src/dto/github.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/entities/user.entity';
import { ReportLog } from 'src/entities/report-log.entity';
import { ProcessStatus } from 'src/entities/enum';
import { MonthlyReport } from 'src/entities/monthly-report.entity';
import { OauthInfo } from 'src/entities/oauth-info.entity';

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(UserRepository.Repository)
    private readonly userRepoRepository: Repository<UserRepository.Repository>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ReportLog)
    private readonly reportLogsRepository: Repository<ReportLog>,
    @InjectRepository(MonthlyReport)
    private readonly monthlyReportsRepository: Repository<MonthlyReport>,
    private httpService: HttpService,
  ) {}

  async getGitRepository(username: string) {
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/users/${username}/repos`, {
        method: 'GET',
        headers: { accept: 'application/vnd.github.v3+json' },
        params: { sort: 'updated', direction: 'desc', per_page: 10, page: 1 },
      }),
    );
    // if(!responseData || !responseData.data) throw new NotFoundException('Repository 정보를 가져올 수 없습니다.')
    return responseData.data;
  }

  async getUserRepository(userId: string): Promise<repositoryThumbnailDto[]> {
    const rtnRepositories: repositoryThumbnailDto[] = [];
    const userRepoGitIds: string[] = [];

    const userInfo = await this.usersRepository.findOne(userId);
    if (!userInfo) throw new NotFoundException('조회할 수 없는 유저 입니다.');
    const { username } = userInfo;
    const selectedUserRepos = await this.userRepoRepository.find({
      where: { user: { id: userId } },
      order: { id: 'ASC' },
    });
    for (const { gitRepoId, repoName } of selectedUserRepos) {
      userRepoGitIds.push(gitRepoId);
      const html_url = `${username}/${repoName}`;
      rtnRepositories.push({
        gitRepoId,
        repoName,
        html_url,
        isSelect: true,
      });
    }

    const gitRepoResult = await this.getGitRepository(username);

    for (const { id, full_name, html_url } of gitRepoResult) {
      if (userRepoGitIds.includes(id)) continue;
      rtnRepositories.push({
        gitRepoId: id,
        repoName: full_name,
        html_url,
        isSelect: false,
      });
    }
    return rtnRepositories;
  }

  async updateUserRepository(
    userId: string,
    data: repositoryDto[],
  ): Promise<UserRepository.Repository[]> {
    await this.userRepoRepository.delete({ user: { id: userId } });

    const newRepoEntities = data.map(({ gitRepoId, repoName }) =>
      this.userRepoRepository.create({
        gitRepoId,
        repoName,
        user: { id: userId },
      }),
    );

    const rtnData = await this.userRepoRepository.save(newRepoEntities);
    // 이번달 1일 전으로있는 분석결과면 save. 1일 포함 이후로 분석결과 있으면 save X!
    const thisMonthDay1 = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );
    const preReportLog = await this.reportLogsRepository.findOne({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
    if (
      !preReportLog ||
      preReportLog.updatedAt < thisMonthDay1 ||
      preReportLog.reportStatus == ProcessStatus.FAIL
    ) {
      await this.reportLogsRepository.save(
        this.reportLogsRepository.create({
          reportStatus: ProcessStatus.REQUEST,
          user: { id: userId },
        }),
      );
    }
    return rtnData;
  }

  // manual하게 분석결과 생성 - 10분 마다
  // 한사람 분석 시간 잴 것
  // 돌아가는 시간 보고, reportLog 처리할 제한 개수 설정하기
  // async createManualReport(): Promise<reportLogDto[]> {
  async createManualReport(): Promise<any[]> {
    const thisMonthFirstDay = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );

    // 이번달에 REQUEST 상태인 reportlog에 대해 분석할 것이므로, 해당하는 reportlog를 가져옴.
    const reportLogResult: requestRepoInputDto[] =
      await this.reportLogsRepository
        .createQueryBuilder('reportLog')
        .select('reportLog.id', 'reportLogId')
        .addSelect('user.id', 'userId')
        .addSelect('user.username', 'username')
        .addSelect('oauthInfo.accessToken', 'gitAccessToken')
        .where('reportLog.reportStatus =:statusValue', {
          statusValue: ProcessStatus.REQUEST,
        })
        .andWhere('reportLog.updatedAt >= :thisMonthFirstDay', {
          thisMonthFirstDay,
        })
        .innerJoin(User, 'user', 'reportLog.user = user.id')
        .innerJoin(OauthInfo, 'oauthInfo', 'oauthInfo.userId = user.id')
        .getRawMany();

    const sample = [
      {
        reportLog_id: '1',
        user_id: '1',
        user_username: 'akalswl14',
        oauthInfo_accessToken: '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',
      },
    ];

    const rtnLogs: reportLogDto[] = [];

    for (const {
      reportLogId,
      userId,
      username,
      gitAccessToken,
    } of reportLogResult) {
      const targetLog = await this.reportLogsRepository.findOne(reportLogId);

      if (!targetLog) {
        rtnLogs.push({
          reportId: null,
          reportLogId,
          reportStatus: null,
          repoNames: [],
          description: '유효하지 않은 report Log 입니다.',
        });
        continue;
      }
      if (targetLog.reportStatus != ProcessStatus.REQUEST) {
        rtnLogs.push({
          reportId: null,
          reportLogId,
          reportStatus: null,
          repoNames: [],
          description: 'request 상태가 아닌 report Log 입니다.',
        });
        continue;
      }

      // // Report Log를 작업중 상태로 변경
      // await this.reportLogsRepository.update(
      //   { id },
      //   { reportStatus: ProcessStatus.ONPROGRESS },
      // );

      // 작업 시작
      const repoIds: string[] = [];
      let commitData: any[] = [];
      // const monthlyCommitLog // [{date:Date,commitNum:number}]

      // 1. Commit -> 월간 commit log, 월간 총 commit 수, 지난달 대비 commit 수 변화

      // user repository data 가져오기
      const userRepositoryResult = await this.getUserRepositoryIds(userId);

      Logger.log('USER REPOSITORY 데이터 가져오기');
      Logger.log(JSON.stringify(userRepositoryResult));

      // 레포별로 조회해, 기간 내 전체 커밋 로그 가져오기 ( default branch 기준 )
      for (const { gitRepoId, repoName } of userRepositoryResult) {
        const { status, message, data } = await this.getGitCommitData(
          username,
          repoName,
          gitAccessToken,
        );
        if (status != 200) {
          Logger.log(
            JSON.stringify({
              service: 'getGitCommitData',
              input: { username, repoName, gitAccessToken: 'not in log' },
              message,
              datalength: data.length,
            }),
          );
        }
        commitData = [...commitData, ...data];
        repoIds.push(gitRepoId);
      }

      // 총 commit 수
      const commitNum = commitData.length;
      Logger.log('총 커밋 수');
      Logger.log(JSON.stringify({ commitNum }));

      // 마지막 분석 대비 commit 수
      // 마지막 분석 결과 데이터 가져오기
      const lastMonthlyReport = await this.monthlyReportsRepository.findOne({
        where: { user: { id: userId } },
        order: { updatedAt: 'ASC' },
      });
      const lastCommitNum = lastMonthlyReport ? lastMonthlyReport.commitNum : 0;
      const momCommitNum = commitNum - lastCommitNum;

      Logger.log('mom 커밋 수');
      Logger.log(JSON.stringify({ momCommitNum }));

      // 월간 commit log
      // 마지막 분석 결과 생성일 가져오기
      const lastReportDate = lastMonthlyReport?.updatedAt;
      // 지난 달의 commit 기록을 저장하기 위한 리스트 생성
      const monthlyCommitLog = this.createMonthlyCommitLogObject();
      for (const {
        commit: {
          committer: { date: commitLogDate },
        },
      } of commitData) {
        const targetDate = new Date(commitLogDate).getDate();
        monthlyCommitLog[targetDate - 1].commitNum++;
      }
      Logger.log('월간 commit log');
      Logger.log(JSON.stringify({ monthlyCommitLog }));
      // log 다 0뜸 데이터 하나도 안들어감. 왜?
      break;
    }
    return [];
  }

  // 정기적으로 분석결과 생성 - 매달 1회
  async createMonthlyReport(): Promise<reportLogDto[]> {
    // 정기 update - 이번달에 reportlog가 없거나, 있어도 SUCCESS 상태이거나 ONPROGRESS 상태이거나 REQUEST 상태가 아닐 경우.
    const reportLogResult = await this.reportLogsRepository.find({
      where: { reportStatus: ProcessStatus.REQUEST, updatedAt: {} },
    });
    Logger.log(JSON.stringify(reportLogResult));
    return [];
    // for (const iterator of object) {
    // }
    return [];
  }

  async getGitCommitData(
    username: string,
    repoName: string,
    gitAccessToken: string,
  ): Promise<{
    status: number | null;
    message: string | null;
    data: any[] | null;
  }> {
    // ex. repoName = akalwl14/jobup-backend
    const thisMonthDay1 = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );

    const prevMonthFirstDay = new Date();
    prevMonthFirstDay.setDate(0);
    prevMonthFirstDay.setDate(1);
    prevMonthFirstDay.setHours(0, 0, 0, 0);
    const prevMonthLastDay = new Date();
    prevMonthLastDay.setDate(0);
    prevMonthLastDay.setHours(0, 0, 0, 0);

    const rtnCommitData = [];
    const per_page = 100;
    var page = 1;

    while (true) {
      try {
        const responseData = await lastValueFrom(
          this.httpService.get(
            `https://api.github.com/repos/${repoName}/commits`,
            {
              method: 'GET',
              headers: {
                accept: 'application/vnd.github.v3+json',
                Authorization: `token ${gitAccessToken}`,
              },
              params: {
                author: username,
                since: prevMonthFirstDay,
                until: prevMonthLastDay,
                per_page,
                page: 1,
              },
            },
          ),
        );
        if (!responseData || !responseData.data) {
          page++;
          continue;
        }
        rtnCommitData.push(responseData.data);
        if (responseData.data.length < per_page) break;
        page++;
      } catch (e) {
        // "config","request","response","isAxiosError","toJSON"
        // Logger.log(JSON.stringify(e.toJSON().status));
        return {
          status: e.toJSON().status,
          message: e.toJSON().message,
          data: rtnCommitData,
        };
      }
    }
    // 이 레포의 월간 commit 기록 - 레포의 default 브랜치로만 기준으로 가져옴
    // https://api.github.com/repos/akalswl14/jobup-backend/commits

    return { status: 200, message: null, data: rtnCommitData };
  }

  async getGitStarData(repoName: string): Promise<number | null> {
    // ex. repoName = akalwl14/jobup-backend
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/repos/${repoName}`, {
        method: 'GET',
        headers: { accept: 'application/vnd.github.v3+json' },
      }),
    );
    if (!responseData || !responseData.data) return null;

    return responseData.data.stargazers_count;
  }

  async getUserRepositoryIds(
    userId: string,
  ): Promise<{ gitRepoId: string; repoName: string }[]> {
    const repoData = await this.userRepoRepository.find({
      where: { id: userId },
      order: { createdAt: 'ASC' },
    });
    return repoData.map(({ gitRepoId, repoName }) => ({ gitRepoId, repoName }));
  }
  // async getGitLanguageData1(repoName: string):Promise<{gitRepoId:string,repoName:string, stargazers_count:number}|null> {
  // ex. repoName = akalwl14/jobup-backend
  // const responseData = await lastValueFrom(
  //   this.httpService.get(`https://api.github.com/repos/${repoName}`, {
  //     method: 'GET',
  //     headers: { accept: 'application/vnd.github.v3+json' },
  //   }),
  // );
  // // 이 레포의 월간 commit 기록
  // // https://api.github.com/repos/akalswl14/jobup-backend/commits
  // // 이 레포의 총 star 수 : stargazers_count
  // // 이 레포의 language 분포
  // // https://api.github.com/repos/akalswl14/jobup-backend/languages
  // if (!responseData || !responseData.data) return null;
  // const { id: gitRepoId } = responseData.data;
  // return { gitRepoId, repoName, stargazers_count };
  // }

  createMonthlyCommitLogObject(): { commitDate: Date; commitNum: number }[] {
    var prevMonthLastDay = new Date(new Date().setDate(0));
    prevMonthLastDay.setHours(0, 0, 0, 0);
    const dayNum = prevMonthLastDay.getDate();
    const rtnObject = [];
    for (let i = 1; i <= dayNum; i++) {
      rtnObject.push({
        commitDate: new Date(new Date(prevMonthLastDay).setDate(i)),
        commitNum: 0,
      });
    }
    return rtnObject;
  }
}
