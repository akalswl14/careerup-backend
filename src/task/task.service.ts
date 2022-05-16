import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { searchOptionDto } from 'src/dto/output.dto';
import { userWishTaskDto, wishTaskOptionDto } from 'src/dto/task.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(WishTask)
    private readonly wishTasksRepository: Repository<WishTask>,
  ) {}

  // Task 목록
  async getTask(): Promise<{ id: string; taskName: string }[]> {
    return this.tasksRepository.find({
      where: { isDuplicate: false },
      select: ['id', 'taskName'],
    });
  }

  // 관심 Task 목록
  async getWishTask(userId: string): Promise<userWishTaskDto[]> {
    const wishTaskData = await this.wishTasksRepository.find({
      where: { user: { id: userId } },
      select: ['priority'],
      relations: ['task'],
      order: { priority: 'ASC' },
    });
    return wishTaskData.map(({ task: { id, taskName }, priority }) => ({
      id,
      taskName,
      priority,
    }));
  }

  // 관심 Task 선택지 목록
  async getWishTaskOption({
    userId,
    priority,
  }: {
    userId: string;
    priority: string;
  }): Promise<wishTaskOptionDto[]> {
    const taskData = await this.tasksRepository.find({
      where: { isDuplicate: false },
      select: ['id', 'taskName'],
    });
    const wishTaskId = await this.getWishTaskOne({ userId, priority });
    const wishTaskData: { id: string; taskName: string; isWish: boolean }[] =
      taskData.map((targetTask) =>
        targetTask.id === wishTaskId
          ? { ...targetTask, isWish: true }
          : { ...targetTask, isWish: false },
      );
    return wishTaskData;
  }

  // 유저의 해당 순위 관심 Task 조회
  async getWishTaskOne({
    userId,
    priority,
  }: {
    userId: string;
    priority: number | string;
  }): Promise<string> | null {
    try {
      const {
        task: { id: taskId },
      } = await this.wishTasksRepository.findOne({
        where: { user: { id: userId }, priority: +priority },
      });
      return taskId;
    } catch {
      return null;
    }
  }

  // 기존의 관심직무를 전체 삭제하므로, 변경된 관심직무만 넘겨주는 것이 아닌 전체 관심직무 설정 데이터가 input으로 들어와야함
  async setWishTask({
    wishTask,
    userId,
  }: {
    wishTask: { id: string; priority: string }[];
    userId: string;
  }) {
    //   기존의 관심 직무 삭제
    await this.wishTasksRepository.delete({ user: { id: userId } });
    const createWishTaskData: {
      user: { id: string };
      task: { id: string };
      priority: number;
    }[] = [];
    for (const { id: taskId, priority: inputPriority } of wishTask) {
      const priority = +inputPriority;
      if (priority == 0 || priority > 3) continue;
      createWishTaskData.push({
        user: { id: userId },
        task: { id: taskId },
        priority,
      });
    }
    await this.wishTasksRepository.save(createWishTaskData);
  }

  async getSearchTask(): Promise<searchOptionDto[]> {
    const taskResult = await this.tasksRepository.find({
      where: { isDuplicate: false },
      select: ['id', 'taskName'],
      order: { id: 'ASC' },
    });
    return taskResult.map(({ id, taskName }) => ({
      id,
      optionName: taskName,
      type: 0,
    }));
  }
}
