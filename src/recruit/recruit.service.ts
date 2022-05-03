import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { recruitThumbnailDto } from 'src/dto/recruit.dto';
import { Recruit } from 'src/entities/recruit.entity';
import { WishRecruit } from 'src/entities/wish-recruit.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { Pagination, PaginationOption } from 'src/paginate';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitsRepository: Repository<Recruit>,
    @InjectRepository(WishTask)
    private readonly wishTasksRepository: Repository<WishTask>,
    @InjectRepository(WishRecruit)
    private readonly wishRecruitsRepository: Repository<WishRecruit>,
  ) {}
  /**
   * 오늘의 공고 API.
   */
  async getTodayRecruits(
    { take, page }: PaginationOption,
    userId: string,
  ): Promise<Pagination<recruitThumbnailDto>> {
    const rtnRecruits: recruitThumbnailDto[] = [];

    const wishTasks = await this.wishTasksRepository.find({
      where: { user: { id: userId } },
      select: ['taskId'],
      order: { priority: 'ASC' },
    });
    const taskIdList = wishTasks.map(({ taskId }) => taskId);
    Logger.log(JSON.stringify(wishTasks));

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
      .where('recruit.createdAt >= :startTermDate', {
        startTermDate: new Date(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
        ),
      })
      .andWhere('( recruit.dueDate >= :nowDate OR recruit.dueDate IS NULL )', {
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

    for (const {
      id,
      recruitTitle: title,
      companyName,
      recruitCareer: career,
      recruitSchool: school,
    } of taskRecruits) {
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
    }

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
}
