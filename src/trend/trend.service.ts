import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { trendTaskDto, trendTaskToStackDto } from 'src/dto/trend.dto';
import { StackToStack } from 'src/entities/stack-to-stack.entity';
import { TaskToStack } from 'src/entities/task-to-stack.entity';
import { Task } from 'src/entities/task.entity';
import { getConnection, In, Repository } from 'typeorm';

@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(TaskToStack)
    private readonly taskToStacksRepostiory: Repository<TaskToStack>,
    @InjectRepository(StackToStack)
    private readonly stackToStacksRepository: Repository<StackToStack>,
  ) {}

  async getTrendTask(): Promise<trendTaskDto[]> {
    /* 제외항목
    - 네트워크
    - it컨설팅
    - dba
    - si개발
    */
    const trendTaskCodes: string[] = [
      '80',
      '81',
      '82',
      '83',
      '84',
      '85',
      '86',
      '87',
      '88',
      '89',
      '90',
      '91',
      '92',
      '97',
      '99',
      '100',
      '181',
      '153',
      '128',
      '184',
    ];

    const trendTaskQueryResult = await this.tasksRepository.find({
      where: { taskCode: In(trendTaskCodes) },
      select: ['id'],
    });
    const trendTaskIds = trendTaskQueryResult.map(({ id }) => id);

    return await getConnection()
      .createQueryBuilder()
      .select('recruitToTask.taskId', 'taskId')
      .addSelect('task.taskName', 'taskName')
      .addSelect('COUNT(recruitToTask.recruitId)', 'recruitNum')
      .from('recruit_tasks_task', 'recruitToTask')
      .where('task.id IN (:...trendTaskIds)', { trendTaskIds })
      .innerJoin(Task, 'task', 'recruitToTask.taskId = task.id')
      .groupBy('"taskId", "taskName"')
      .orderBy('"recruitNum"', 'DESC')
      .addOrderBy('"taskId"', 'ASC')
      .getRawMany();
  }

  async getTrendTaskToStack(taskId: string): Promise<trendTaskToStackDto[]> {
    const taskToStackResult: { stackName: string; num: number }[] =
      await this.taskToStacksRepostiory
        .createQueryBuilder('taskToStack')
        .select('taskToStack.stack', 'stackName')
        .addSelect('taskToStack.num', 'num')
        .where('taskToStack.taskId =:taskId', { taskId })
        .groupBy('"stackName","num"')
        .orderBy('taskToStack.num', 'DESC')
        .getRawMany();
    var idx = 1;
    const taskDetailData: trendTaskToStackDto[] = taskToStackResult.map(
      ({ stackName, num }) => ({
        stackId: idx++,
        stackName,
        num,
        innerStacks: [],
      }),
    );
    for (let index = 0; index < taskDetailData.length; index++) {
      const stackToStackResult = await this.stackToStacksRepository
        .createQueryBuilder('stackToStack')
        .select('stackToStack.innerStack', 'innerStack')
        .where('stackToStack.taskId =:taskId', { taskId })
        .andWhere('stackToStack.stack =:stackName', {
          stackName: taskDetailData[index].stackName,
        })
        .groupBy('stackToStack.innerStack')
        .orderBy('stackToStack.innerStack', 'DESC')
        .take(3)
        .getRawMany();
      const innerStacks = stackToStackResult.map(
        ({ innerStack }) => innerStack,
      );
      taskDetailData[index].innerStacks = innerStacks;
    }
    return taskDetailData;
  }
}
