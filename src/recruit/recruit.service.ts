import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  recruitDetailDto,
  recruitThumbnailDto,
  searchRecruitQueryDto,
  tagThumbnailDto,
} from 'src/dto/recruit.dto';
import { Recruit } from 'src/entities/recruit.entity';
import { TrendStack } from 'src/entities/trend-stack.entity';
import { WishRecruit } from 'src/entities/wish-recruit.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { Pagination, PaginationOption } from 'src/paginate';
import { getConnection, OrderByCondition, Repository } from 'typeorm';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitsRepository: Repository<Recruit>,
    @InjectRepository(WishTask)
    private readonly wishTasksRepository: Repository<WishTask>,
    @InjectRepository(WishRecruit)
    private readonly wishRecruitsRepository: Repository<WishRecruit>,
    @InjectRepository(TrendStack)
    private readonly trendStacksRepository: Repository<TrendStack>,
  ) {}
  /**
   * 오늘의 공고 API.
   */
  async getTodayRecruits(
    { take, page }: PaginationOption,
    userId: string,
  ): Promise<Pagination<recruitThumbnailDto>> {
    const wishTasks = await this.wishTasksRepository.find({
      where: { user: { id: userId } },
      select: ['taskId'],
      order: { priority: 'ASC' },
    });
    const taskIdList = wishTasks.map(({ taskId }) => taskId);

    const [taskRecruits, totalRecruitNum] = await this.recruitsRepository
      .createQueryBuilder('recruit')
      .innerJoinAndSelect(
        'recruit.tasks',
        'task',
        'task.id IN (:...taskIdList)',
        {
          taskIdList,
        },
      )
      .where('( recruit.dueDate >= :nowDate OR recruit.dueDate IS NULL )', {
        nowDate: new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
        ),
      })
      .take(take)
      .skip(take * (page - 1))
      .orderBy({
        'recruit.dueDate': { order: 'ASC', nulls: 'NULLS LAST' },
        'recruit.id': 'DESC',
        'recruit.createdAt': 'DESC',
      })
      .getManyAndCount();
    // 날짜 제한하는 쿼리. 나중에 추가
    // .andWhere('recruit.createdAt >= :startTermDate', {
    //   startTermDate: new Date(
    //     new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
    //   ),
    // })

    const rtnRecruits: recruitThumbnailDto[] =
      await this.formatRecruitThumbnail(taskRecruits, userId);

    return new Pagination<recruitThumbnailDto>({
      total: totalRecruitNum,
      results: rtnRecruits,
    });
  }

  async toggleWishRecruit(recruitId: string, userId: string): Promise<Boolean> {
    const wishCnt = await this.wishRecruitsRepository.count({
      where: { user: { id: userId }, recruit: { id: recruitId } },
    });
    if (wishCnt > 0) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(WishRecruit)
        .where('userId = :userId AND recruitId = :recruitId', {
          userId,
          recruitId,
        })
        .execute();
      return false;
    } else {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(WishRecruit)
        .values({ user: { id: userId }, recruit: { id: recruitId } })
        .execute();
      return true;
    }
  }

  async getRecommendRecruits(userId: string): Promise<recruitThumbnailDto[]> {
    let queryRecruits: Recruit[] = [];
    // 사용자의 희망 직무 반환
    const wishTaskResult = await this.wishTasksRepository.find({
      where: { user: { id: userId } },
      select: ['taskId'],
      order: { priority: 'ASC' },
    });
    if (!wishTaskResult)
      throw new NotFoundException(`wish_task 결과가 없습니다`);
    // 사용자의 희망 직무별 trendstack 찾아서 recruit 데이터 반환
    for (const { taskId: wishTaskId } of wishTaskResult) {
      const trendStackResult = await this.trendStacksRepository.find({
        where: { taskId: wishTaskId },
        select: ['techstackId'],
        order: { priority: 'ASC' },
        take: 3,
      });
      if (!trendStackResult || trendStackResult.length == 0)
        throw new NotFoundException(`trend_stack 결과가 없습니다`);

      let recruitIdList: string[] = [];
      for (const { techstackId: trendStackId } of trendStackResult) {
        const [recruitsResult, recruitIdsResult] =
          await this.getMainRecruitsWithTags(
            wishTaskId,
            trendStackId,
            4 - queryRecruits.length,
          );
        queryRecruits = [...queryRecruits, ...recruitsResult];
        recruitIdList = [...recruitIdList, ...recruitIdsResult];

        if (queryRecruits.length >= 4) break;
      }

      if (queryRecruits.length >= 4) {
        break;
      } else {
        // trendstack 1, 2, 3 순위로도 4개의 공고가 검색되지 않을 경우, 해당 task로만 공고를 검색한다
        const recruitsResult = await this.getMainRecruitsWithTask(
          wishTaskId,
          4 - queryRecruits.length,
          recruitIdList,
        );
        queryRecruits = [...queryRecruits, ...recruitsResult];

        if (queryRecruits.length >= 4) break;
      }
    }
    return this.formatRecruitThumbnail(queryRecruits, userId, 4);
  }

  async getSearchRecruits(
    {
      take = 10,
      page = 1,
      type = 0,
      keyword,
      order = 0,
    }: searchRecruitQueryDto,
    userId: string,
  ): Promise<Pagination<recruitThumbnailDto>> {
    const innerJoinOption =
      type == 1
        ? {
            subQueryFactory: 'recruit.techstacks',
            alias: 'techstack',
            condition: 'techstack.id =:keyword',
            parameters: { keyword },
          }
        : {
            subQueryFactory: 'recruit.tasks',
            alias: 'task',
            condition: 'task.id =:keyword',
            parameters: { keyword },
          };
    const orderByOption: OrderByCondition =
      order == 0
        ? {
            'recruit.createdAt': 'DESC',
            'recruit.dueDate': { order: 'ASC', nulls: 'NULLS LAST' },
            'recruit.id': 'DESC',
          }
        : {
            'recruit.dueDate': { order: 'ASC', nulls: 'NULLS LAST' },
            'recruit.createdAt': 'DESC',
            'recruit.id': 'DESC',
          };
    const [searchRecruits, totalRecruitNum] = await this.recruitsRepository
      .createQueryBuilder('recruit')
      .innerJoinAndSelect(
        innerJoinOption.subQueryFactory,
        innerJoinOption.alias,
        innerJoinOption.condition,
        innerJoinOption.parameters,
      )
      .where('( recruit.dueDate >= :nowDate OR recruit.dueDate IS NULL )', {
        nowDate: new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
        ),
      })
      .take(take)
      .skip(take * (page - 1))
      .orderBy(orderByOption)
      .getManyAndCount();

    const rtnRecruits: recruitThumbnailDto[] =
      await this.formatRecruitThumbnail(searchRecruits, userId);
    return new Pagination<recruitThumbnailDto>({
      total: totalRecruitNum,
      results: rtnRecruits,
    });
  }

  async getRecruitDetail(
    recruitId: string,
    userId: string,
  ): Promise<recruitDetailDto> {
    const recruitResult = await this.recruitsRepository
      .createQueryBuilder('recruit')
      .where('recruit.id =:recruitId', { recruitId })
      .leftJoinAndSelect('recruit.tasks', 'task')
      .leftJoinAndSelect('recruit.techstacks', 'techstack')
      .getOne();

    if (!recruitResult)
      throw new NotFoundException(`조회할 수 없는 recruit 입니다.`);

    const recruitTasks: tagThumbnailDto[] = recruitResult.tasks.map(
      ({ id, taskName }) => ({ id, type: 0, tagName: taskName }),
    );
    const recruitTechstacks: tagThumbnailDto[] = recruitResult.techstacks.map(
      ({ id, stackName }) => ({ id, type: 1, tagName: stackName }),
    );
    const cntWishRecruits = await this.wishRecruitsRepository.count({
      recruit: { id: recruitId },
      user: { id: userId },
    });
    return {
      id: recruitId,
      title: recruitResult.recruitTitle,
      companyName: recruitResult.companyName,
      recruitTag: [...recruitTasks, ...recruitTechstacks],
      career: recruitResult.recruitCareer,
      school: recruitResult.recruitSchool,
      condition: recruitResult.recruitCondition,
      location: recruitResult.recruitLocation,
      dueDate: recruitResult.dueDate,
      dueType: recruitResult.dueType,
      saraminUri: recruitResult.recruitCode,
      isWish: cntWishRecruits > 0 ? true : false,
    };
  }
  async getMainRecruitsWithTags(
    taskId: string,
    techstackId: string,
    takeNum: number,
  ): Promise<[Recruit[], string[]]> {
    const recruitResult = await this.recruitsRepository
      .createQueryBuilder('recruit')
      .innerJoinAndSelect('recruit.tasks', 'task', 'task.id =:taskId', {
        taskId,
      })
      .innerJoinAndSelect(
        'recruit.techstacks',
        'techstack',
        'techstack.id =:techstackId',
        { techstackId },
      )
      .where('( recruit.dueDate >= :nowDate OR recruit.dueDate IS NULL )', {
        nowDate: new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
        ),
      })
      .orderBy({
        'recruit.dueDate': { order: 'ASC', nulls: 'NULLS LAST' },
        'recruit.id': 'DESC',
        'recruit.createdAt': 'DESC',
      })
      .take(takeNum)
      .getMany();
    //  날짜 제한하는 쿼리. 나중에 추가할 것
    // .andWhere('recruit.createdAt >= :startTermDate', {
    //   startTermDate: new Date(
    //     new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
    //   ),
    // })
    const idList = recruitResult.map(({ id }) => id);
    return [recruitResult, idList];
  }
  async getMainRecruitsWithTask(
    taskId: string,
    takeNum: number,
    exceptIds?: string[],
  ): Promise<Recruit[]> {
    return this.recruitsRepository
      .createQueryBuilder('recruit')
      .innerJoinAndSelect('recruit.tasks', 'task', 'task.id =:taskId', {
        taskId,
      })
      .where('( recruit.dueDate >= :nowDate OR recruit.dueDate IS NULL )', {
        nowDate: new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
        ),
      })
      .andWhere('recruit.id NOT IN (:...exceptIds)', { exceptIds })
      .orderBy({
        'recruit.dueDate': { order: 'ASC', nulls: 'NULLS LAST' },
        'recruit.id': 'DESC',
        'recruit.createdAt': 'DESC',
      })
      .take(takeNum)
      .getMany();
    //  날짜 제한하는 쿼리. 나중에 추가할 것
    // .andWhere('recruit.createdAt >= :startTermDate', {
    //   startTermDate: new Date(
    //     new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
    //   ),
    // })
  }

  async formatRecruitThumbnail(
    targetRecruits: Recruit[],
    userId: string,
    limitNum?: number,
  ): Promise<recruitThumbnailDto[]> {
    const rtnRecruits = [];
    for (const {
      id,
      recruitTitle: title,
      companyName,
      recruitCareer: career,
      recruitSchool: school,
    } of targetRecruits) {
      const cntWishRecruits = await this.wishRecruitsRepository.count({
        recruit: { id },
        user: { id: userId },
      });
      rtnRecruits.push({
        id,
        title,
        companyName,
        career,
        school,
        isWish: cntWishRecruits > 0 ? true : false,
      });
      if (limitNum && rtnRecruits.length == limitNum) break;
    }
    return rtnRecruits;
  }
}
