import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import * as UserRepository from 'src/entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  languageToTaskDto,
  monthlyReportThumbnail,
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
import { WishTask } from 'src/entities/wish-task.entity';
import { Language } from 'src/entities/language.entity';
import { StackToLanguage } from 'src/entities/stack-to-language.entity';
import { Memoir } from 'src/entities/memoir.entity';

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
    @InjectRepository(OauthInfo)
    private readonly oauthInfosRepository: Repository<OauthInfo>,
    @InjectRepository(WishTask)
    private readonly wishTasksRepository: Repository<WishTask>,
    @InjectRepository(Language)
    private readonly languagesRepostiory: Repository<Language>,
    @InjectRepository(StackToLanguage)
    private readonly stackToLanguagesRepostiory: Repository<StackToLanguage>,
    @InjectRepository(Memoir)
    private readonly memoirsRepository: Repository<Memoir>,
    private httpService: HttpService,
  ) {}

  async getGitRepository(gitAccessToken: string) {
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/user/repos`, {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github.v3+json',
          Authorization: `token ${gitAccessToken}`,
        },
        params: { sort: 'updated', direction: 'desc', per_page: 10, page: 1 },
      }),
    );
    if (!responseData || !responseData.data)
      throw new NotFoundException('Repository 정보를 가져올 수 없습니다.');
    return responseData.data;
  }

  async getUserRepository(userId: string): Promise<repositoryThumbnailDto[]> {
    const rtnRepositories: repositoryThumbnailDto[] = [];
    const userRepoGitIds: number[] = [];

    const userInfo = await this.usersRepository.findOne(userId);
    const userOauthInfo = await this.oauthInfosRepository.findOne({
      user: { id: userId },
    });
    if (!userInfo || !userOauthInfo)
      throw new NotFoundException('조회할 수 없는 유저 입니다.');
    const { username } = userInfo;
    const { accessToken } = userOauthInfo;
    const selectedUserRepos = await this.userRepoRepository.find({
      where: { user: { id: userId } },
      order: { id: 'ASC' },
    });
    for (const { gitRepoId, repoName } of selectedUserRepos) {
      userRepoGitIds.push(Number(gitRepoId));
      const html_url = `https://github.com/${username}/${repoName}`;
      rtnRepositories.push({
        gitRepoId: Number(gitRepoId),
        repoName,
        html_url,
        isSelect: true,
      });
    }

    const gitRepoResult = await this.getGitRepository(accessToken);

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
        gitRepoId: gitRepoId.toString(),
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
  async createManualReport(): Promise<reportLogDto[]> {
    // 이번달에 REQUEST 상태인 reportlog에 대해 분석할 것이므로, 해당하는 reportlog를 가져옴.
    const requestReportLogs: requestRepoInputDto[] =
      await this.getRequestReportLog();

    const rtnLogs: reportLogDto[] = [];

    for (const {
      reportLogId,
      userId,
      username,
      gitAccessToken,
    } of requestReportLogs) {
      const repoIds: string[] = [];
      try {
        const targetLog = await this.reportLogsRepository.findOne(reportLogId);

        if (!targetLog) {
          rtnLogs.push({
            reportId: null,
            reportLogId,
            reportStatus: null,
            repoIds: [],
            description: '유효하지 않은 report Log 입니다.',
          });
          continue;
        }
        if (targetLog.reportStatus != ProcessStatus.REQUEST) {
          rtnLogs.push({
            reportId: null,
            reportLogId,
            reportStatus: null,
            repoIds: [],
            description: 'request 상태가 아닌 report Log 입니다.',
          });
          continue;
        }

        // Report Log를 작업중 상태로 변경
        await this.reportLogsRepository.update(
          { id: reportLogId },
          { reportStatus: ProcessStatus.ONPROGRESS },
        );

        // 작업 시작
        let commitData: any[] = [];
        let starNum = 0;
        let mostStarRepo: string;
        let mostStarRepoNum = -1;
        const languageData: { [languageName: string]: number } = {};

        // 1. Commit -> 월간 commit log, 월간 총 commit 수, 지난달 대비 commit 수 변화
        // user repository data 가져오기
        const userRepositoryResult = await this.getUserRepositoryIds(userId);

        // 레포별로 git 정보 가져오기 ( default branch 기준 )
        for (const { gitRepoId, repoName } of userRepositoryResult) {
          // 이 레포의 커밋 로그 가져오기
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

          // 이 레포의 Star 수 가져와 총 Star 수에 반영하고, 제일 많은 Star 받은 레포인지 확인
          const targetStar = await this.getGitStarData(
            repoName,
            gitAccessToken,
          );
          if (targetStar == null) {
            rtnLogs.push({
              reportId: null,
              reportLogId,
              reportStatus: ProcessStatus.FAIL,
              repoIds,
              description: `${repoName} 레포지터리의 상세 정보를 가져올 수 없습니다.`,
            });
            await this.reportLogsRepository.update(
              { id: reportLogId },
              { reportStatus: ProcessStatus.FAIL },
            );
            continue;
          }
          starNum += targetStar;
          if (mostStarRepoNum < targetStar) {
            mostStarRepo = repoName;
            mostStarRepoNum = targetStar;
          }

          // 이 레포의 language 데이터 가져오기
          const languageResult = await this.getGitLanguageData(
            repoName,
            gitAccessToken,
          );
          if (!languageResult) {
            rtnLogs.push({
              reportId: null,
              reportLogId,
              reportStatus: ProcessStatus.FAIL,
              repoIds,
              description: `${repoName} 레포지터리의 언어 정보를 가져올 수 없습니다.`,
            });
            await this.reportLogsRepository.update(
              { id: reportLogId },
              { reportStatus: ProcessStatus.FAIL },
            );
            continue;
          }
          const languageKeys = Object.keys(languageResult);
          for (const targetLanguage of languageKeys) {
            languageData[targetLanguage] = languageResult[targetLanguage];
          }
          repoIds.push(gitRepoId);
        }

        // 총 commit 수
        const commitNum = commitData.length;

        // 마지막 분석 대비 commit 수
        const momCommitNum = await this.getMomCommitNum(userId, commitNum);

        // 월간 commit log
        const monthlyCommitLog = await this.getMonthlyCommitLog(commitData);

        // language 데이터 정리
        const languageDetail = this.sortLanguageObjectbyValue(
          languageData,
          false,
        );

        // stack 분석
        const stackAnalysisResult = await this.getStackWithLanguage(
          userId,
          languageDetail,
        );

        await this.monthlyReportsRepository.save(
          this.monthlyReportsRepository.create({
            repoIds,
            commitNum,
            momCommitNum,
            commitDetail: monthlyCommitLog,
            starNum,
            mostStarRepo,
            languageDetail: JSON.stringify(languageDetail),
            stackId: stackAnalysisResult?.techstackId,
            stackName: stackAnalysisResult?.techstackName,
            stackLanguage: stackAnalysisResult?.languageName,
            stackTaskId: stackAnalysisResult?.taskId,
            stackTaskName: stackAnalysisResult?.taskName,
            user: { id: userId },
          }),
        );
        rtnLogs.push({
          reportId: null,
          reportLogId,
          repoIds,
          reportStatus: ProcessStatus.SUCCESS,
          description: null,
        });

        // Report Log를 성공 상태로 변경
        await this.reportLogsRepository.update(
          { id: reportLogId },
          { reportStatus: ProcessStatus.SUCCESS },
        );
        // 테스트용으로 break. 여러 request로 테스트 할때 break 해제하고 해보고, 최종 때 뺼 것
        break;
      } catch (e) {
        rtnLogs.push({
          reportId: null,
          reportLogId,
          repoIds,
          reportStatus: ProcessStatus.FAIL,
          description: e,
        });
        await this.reportLogsRepository.update(
          { id: reportLogId },
          { reportStatus: ProcessStatus.FAIL },
        );
      }
    }
    return rtnLogs;
  }

  getMonthlyCommitLog(commitData: any[]): number[] {
    // 지난 달의 commit 기록을 저장하기 위한 리스트 생성 및 데이터 삽입
    const monthlyCommitLog: number[] = this.createMonthlyCommitLogObject();
    for (const {
      commit: {
        committer: { date: commitLogDate },
      },
    } of commitData) {
      const targetDate = new Date(commitLogDate).getDate();
      let commitNum = monthlyCommitLog[targetDate - 1];
      monthlyCommitLog[targetDate - 1] = commitNum + 1;
    }
    return monthlyCommitLog;
  }

  async getMomCommitNum(userId: string, commitNum: number): Promise<number> {
    const thisMonthFirstDay = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );
    const lastMonthlyReport = await this.monthlyReportsRepository.findOne({
      where: { user: { id: userId }, updatedAt: LessThan(thisMonthFirstDay) },
      order: { updatedAt: 'DESC' },
    });
    const lastCommitNum = lastMonthlyReport ? lastMonthlyReport.commitNum : 0;
    return commitNum - lastCommitNum;
  }

  async getRequestReportLog(): Promise<requestRepoInputDto[]> {
    const thisMonthFirstDay = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );

    return this.reportLogsRepository
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
  }

  // 정기적으로 분석 요청 생성 - 월 1회
  async createMonthlyReportRequest(): Promise<ReportLog[]> {
    // 정기 update - 이번달에 reportlog가 없거나, 있어도 SUCCESS 상태이거나 ONPROGRESS 상태이거나 REQUEST 상태가 아닐 경우.
    const saveData: ReportLog[] = [];
    const thisMonthFirstDay = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );

    const allUsers = await this.usersRepository.find({ select: ['id'] });

    for (const { id: userId } of allUsers) {
      const checkReportLog = await this.reportLogsRepository.findOne({
        where: {
          user: { id: userId },
          updatedAt: MoreThanOrEqual(thisMonthFirstDay),
        },
        order: { updatedAt: 'DESC' },
        select: ['id', 'reportStatus'],
      });
      if (
        checkReportLog?.reportStatus == ProcessStatus.FAIL ||
        !checkReportLog
      ) {
        saveData.push(
          this.reportLogsRepository.create({
            user: { id: userId },
            reportStatus: ProcessStatus.REQUEST,
          }),
        );
      }
    }
    return this.reportLogsRepository.save(saveData);
  }

  // 이 레포의 월간 commit 기록 - 레포의 default 브랜치로만 기준으로 가져옴
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

    const prevMonthFirstDay = new Date();
    prevMonthFirstDay.setDate(0);
    prevMonthFirstDay.setDate(1);
    prevMonthFirstDay.setHours(0, 0, 0, 0);
    const prevMonthLastDay = new Date();
    prevMonthLastDay.setDate(0);
    prevMonthLastDay.setHours(0, 0, 0, 0);

    let rtnCommitData = [];
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
                page,
              },
            },
          ),
        );
        if (!responseData || !responseData.data) {
          page++;
          continue;
        }
        rtnCommitData = [...rtnCommitData, ...responseData.data];
        if (responseData.data.length < per_page) break;
        page++;
      } catch (e) {
        return {
          status: e.toJSON().status,
          message: e.toJSON().message,
          data: rtnCommitData,
        };
      }
    }
    return { status: 200, message: null, data: rtnCommitData };
  }

  async getGitStarData(
    repoName: string,
    gitAccessToken: string,
  ): Promise<number | null> {
    // ex. repoName = akalwl14/jobup-backend
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/repos/${repoName}`, {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github.v3+json',
          Authorization: `token ${gitAccessToken}`,
        },
      }),
    );
    if (!responseData || !responseData.data) return null;

    return responseData.data.stargazers_count;
  }

  async getUserRepositoryIds(
    userId: string,
  ): Promise<{ gitRepoId: string; repoName: string }[]> {
    const repoData = await this.userRepoRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
    return repoData.map(({ gitRepoId, repoName }) => ({ gitRepoId, repoName }));
  }

  async getGitLanguageData(
    repoName: string,
    gitAccessToken: string,
  ): Promise<any[] | null> {
    // ex. repoName = akalwl14/jobup-backend
    const responseData = await lastValueFrom(
      this.httpService.get(
        `https://api.github.com/repos/${repoName}/languages`,
        {
          method: 'GET',
          headers: {
            accept: 'application/vnd.github.v3+json',
            Authorization: `token ${gitAccessToken}`,
          },
        },
      ),
    );
    if (!responseData || !responseData.data) return null;

    return responseData.data;
  }

  createMonthlyCommitLogObject(): number[] {
    var prevMonthLastDay = new Date(new Date().setDate(0));
    prevMonthLastDay.setHours(0, 0, 0, 0);
    const dayNum = prevMonthLastDay.getDate();
    const rtnObject = [];
    return Array.apply(null, Array(dayNum)).map(Number.prototype.valueOf, 0);
  }

  async createCommitReportData() {
    // getGitLanguageData
    return {};
  }

  sortLanguageObjectbyValue(
    languageObj = {},
    asc = false,
  ): { [languageName: string]: number } {
    const rtn = {};
    Object.keys(languageObj)
      .sort((a, b) => languageObj[asc ? a : b] - languageObj[asc ? b : a])
      .forEach((s) => (rtn[s] = languageObj[s]));
    return rtn;
  }

  async getStackWithLanguage(
    userId: string,
    languageDetail: object,
  ): Promise<languageToTaskDto | null> {
    const { idOrderQuery, languageIds } = await this.getQueryAndIdWithLanguage(
      languageDetail,
    );

    const wishTasks = await this.wishTasksRepository.find({
      where: { user: { id: userId } },
      order: { priority: 'ASC' },
      relations: ['task'],
    });

    for (const {
      taskId: wishTaskId,
      task: { taskName: wishTaskName },
    } of wishTasks) {
      const stackResult = await this.stackToLanguagesRepostiory
        .createQueryBuilder('stackToLang')
        .select('techstack.id', 'techstackId')
        .addSelect('techstack.stackName', 'techstackName')
        .addSelect('language.id', 'languageId')
        .addSelect('language.languageName', 'languageName')
        .innerJoin('stackToLang.language', 'language')
        .innerJoin('stackToLang.techstack', 'techstack')
        .where('stackToLang.languageId IN (:...languageIds)', { languageIds })
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('techstack.id', 'techstackId')
            .from('trend_stack', 'trendStack')
            .innerJoin('trendStack.task', 'task')
            .innerJoin('trendStack.techstack', 'techstack')
            .where('trendStack.taskId = :wishTaskId')
            .getQuery();
          return 'stackToLang.techstackId IN ' + subQuery;
        })
        .setParameter('wishTaskId', wishTaskId)
        .orderBy(idOrderQuery)
        .addOrderBy('techstack.stackName', 'ASC')
        .getRawMany();

      if (stackResult && stackResult.length > 0) {
        return {
          taskId: wishTaskId,
          taskName: wishTaskName,
          techstackId: stackResult[0].techstackId,
          techstackName: stackResult[0].techstackName,
          languageName: stackResult[0].languageName,
          languageId: stackResult[0].languageId,
        };
      }
    }
    return null;
  }

  async getQueryAndIdWithLanguage(
    languageDetail: Object,
  ): Promise<{ idOrderQuery: string; languageIds: string[] }> {
    const languages = Object.keys(languageDetail);
    const languageIds: string[] = [];

    var idOrderQuery = 'CASE "language"."id"';
    for (let index = 0; index < languages.length; index++) {
      const languageIdResult = await this.languagesRepostiory.findOne({
        where: { languageName: languages[index] },
        select: ['id'],
      });
      if (languageIdResult) {
        languageIds.push(languageIdResult.id);
        idOrderQuery += ` WHEN ${languageIdResult.id} THEN ${index + 1}`;
      }
    }
    idOrderQuery += ' END';

    /* idOrderQuery EXAMPLE :
     CASE "language"."id" WHEN 605 THEN 1 WHEN 799 THEN 2 WHEN 607 THEN 3 END
     */
    return {
      idOrderQuery,
      languageIds,
    };
  }

  async getMonthlyReport(userId: string): Promise<monthlyReportThumbnail> {
    const reportResult = await this.monthlyReportsRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    if (!reportResult) {
      const reportLogResult = await this.reportLogsRepository.findOne({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
      return {
        status: reportLogResult ? reportLogResult.reportStatus : null,
        contents: null,
        memoir: null,
      };
    }
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['username'],
    });
    delete reportResult['user'];
    delete reportResult['repoIds'];
    delete reportResult['updatedAt'];
    const memoirResult = await this.memoirsRepository.findOne({
      where: { monthlyReport: { id: reportResult.id } },
      order: { createdAt: 'DESC' },
    });
    const languageDetail: { [langName: string]: number } = JSON.parse(
      reportResult.languageDetail,
    );
    const lang = Object.keys(languageDetail);
    const langCount = Object.values(languageDetail);
    delete reportResult['languageDetail'];
    if (
      !(
        reportResult.commitNum ||
        reportResult.momCommitNum ||
        reportResult.starNum ||
        reportResult.mostStarRepo ||
        reportResult.stackName ||
        reportResult.stackLanguage ||
        reportResult.stackTaskName ||
        reportResult.commitDetail
      )
    ) {
      return {
        status: ProcessStatus.FAIL,
        contents: null,
        memoir: null,
      };
    }
    if (
      lang.length == 0 ||
      langCount.length == 0 ||
      lang.length != langCount.length
    ) {
      return {
        status: ProcessStatus.FAIL,
        contents: null,
        memoir: null,
      };
    }
    return {
      status: null,
      contents: {
        ...reportResult,
        username: userInfo ? userInfo.username : '',
        lang,
        langCount,
      },
      memoir: memoirResult
        ? {
            id: memoirResult.id,
            description: memoirResult.description,
            updatedAt: memoirResult.updatedAt,
          }
        : null,
    };
  }
}
