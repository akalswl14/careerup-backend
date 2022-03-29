import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRecruitDto } from 'src/dto/testdata.dto';
import { Recruit } from 'src/entities/recruit.entity';
import { Repository } from 'typeorm';

import * as testData from '../../result.json';

@Injectable()
export class TestdataService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitsRepository: Repository<Recruit>,
  ) {}

  async putTestData(datalength: number): Promise<Boolean> {
    const recruitInfo: TestRecruitDto[] = [];
    for (var i = 0; i < datalength; i++) {
      const targetData = testData[i];
      //   const taskObject = Object.values(targetData.stack);
      //   Logger.log('task : ' + JSON.stringify(taskObject));
      const taskData = targetData.task.map((targetTask) => ({
        taskCode: targetTask,
      }));
      const stackData = targetData.stack.map((targetStack) => ({
        stackCode: targetStack,
      }));
      const dueDate = Date.parse(targetData.dueDate)
        ? new Date(targetData.dueDate)
        : null;
      recruitInfo.push({
        ...targetData,
        tasks: taskData,
        techstacks: stackData,
        dueDate,
        dueType: dueDate ? 1 : 0,
      });
    }
    this.recruitsRepository.save(recruitInfo);
    return true;
  }
}
