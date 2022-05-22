import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { inputMemoirDto, memoirThumbnail } from 'src/dto/memoir.dto';
import { Memoir } from 'src/entities/memoir.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemoirService {
  constructor(
    @InjectRepository(Memoir)
    private readonly memoirsRepository: Repository<Memoir>,
  ) {}

  async getMemoirs(userId: string): Promise<memoirThumbnail[]> {
    const memoirList = await this.memoirsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return memoirList.map(({ id, description, updatedAt }) => ({
      id,
      description,
      updatedAt,
    }));
  }

  async updateMemoir(
    userId: string,
    inputMemoir: inputMemoirDto,
  ): Promise<Boolean> {
    const { id: memoirId, monthlyReportId, description } = inputMemoir;
    if (memoirId) {
      // 기존에 회고록이 있고, 수정하는 경우
      const checkMemoir = await this.memoirsRepository.findOne({
        where: { id: memoirId, user: { id: userId } },
      });
      if (!checkMemoir) {
        // 회고록 조회 실패 - 없는 회고록 이거나, 해당 회고록의 user가 아닌 경우거나,
        throw new NotFoundException({
          description: `조회할 수 없는 Memoir입니다.`,
        });
      }
      await this.memoirsRepository.update({ id: memoirId }, { description });
      return true;
    } else if (monthlyReportId) {
      // 회고록을 새로 생성하는 경우
      await this.memoirsRepository.save(
        this.memoirsRepository.create({
          user: { id: userId },
          monthlyReport: { id: monthlyReportId },
          description,
        }),
      );
      return true;
    } else {
      // 잘못된 input
      throw new BadRequestException({
        description: `잘못된 요청입니다.`,
      });
    }
  }
}
