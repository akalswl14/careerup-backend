import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestLanguageDto,
  TestLanguageInputDto,
  TestRecruitDto,
  TestRecruitInputDto,
  TestStackDto,
  TestStackInputDto,
  TestStackToLanguageInputDto,
  TestTaskDto,
  TestTaskInputDto,
} from 'src/dto/testdata.dto';
import { Language } from 'src/entities/language.entity';
import { Recruit } from 'src/entities/recruit.entity';
import { StackToLanguage } from 'src/entities/stack-to-language.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { TrendStack } from 'src/entities/trend-stack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestdataService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitsRepository: Repository<Recruit>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Techstack)
    private readonly techstacksRepository: Repository<Techstack>,
    @InjectRepository(Language)
    private readonly languagesRepository: Repository<Language>,
    @InjectRepository(TrendStack)
    private readonly trendStacksRepository: Repository<TrendStack>,
    @InjectRepository(StackToLanguage)
    private readonly stackToLanguagesRepository: Repository<StackToLanguage>,
  ) {}

  async putRecruitData(testData: TestRecruitInputDto[]): Promise<Boolean> {
    const recruitInfo: TestRecruitDto[] = [];
    for (const targetData of testData) {
      const taskData: { taskCode: string }[] = targetData.task.map(
        (targetTask) => ({
          taskCode: targetTask,
        }),
      );
      const stackData: { stackCode: string }[] = targetData.stack.map(
        (targetStack) => ({
          stackCode: targetStack,
        }),
      );
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
    await this.recruitsRepository.save(recruitInfo);
    return true;
  }

  async connectRecruitData(testData: TestRecruitInputDto[]): Promise<Boolean> {
    for (const targetData of testData) {
      const { task: targetTask, stack: targetStack } = targetData;
      const targetRecruit = await this.recruitsRepository.findOne({
        where: {
          recruitCode: targetData.recruitCode,
        },
      });
      const taskData: Task[] = [];
      for (const taskCode of targetTask) {
        taskData.push(
          await this.tasksRepository.findOne({ where: { taskCode } }),
        );
      }
      const stackData: Techstack[] = [];
      for (const stackCode of targetStack) {
        stackData.push(
          await this.techstacksRepository.findOne({ where: { stackCode } }),
        );
      }
      await this.recruitsRepository.save({
        ...targetRecruit,
        tasks: taskData,
        techstacks: stackData,
        updatedAt: new Date(),
      });
    }
    return true;
  }

  async putTaskData(testData: TestTaskInputDto[]): Promise<Boolean> {
    const taskInfo: TestTaskDto[] = [];
    for (const targetData of testData) {
      const { task: taskName } = targetData;
      const firstTask = await this.tasksRepository.save({
        taskName,
        taskCode: targetData['code1'],
        isDuplicate: false,
      });
      if (targetData['code2'] !== '') {
        taskInfo.push({
          taskName,
          taskCode: targetData['code2'],
          isDuplicate: true,
          duplicateId: firstTask.id ?? null,
        });
      }
      if (targetData['code3'] !== '') {
        taskInfo.push({
          taskName,
          taskCode: targetData['code3'],
          isDuplicate: true,
          duplicateId: firstTask.id ?? null,
        });
      }
    }
    await this.tasksRepository.save(taskInfo);
    return true;
  }

  async putStackData(testData: TestStackInputDto[]): Promise<Boolean> {
    const stackInfo: TestStackDto[] = [];

    for (const { stack, code1 } of testData) {
      stackInfo.push({
        stackName: stack,
        stackCode: code1,
      });
    }
    await this.techstacksRepository.save(stackInfo);
    return true;
  }

  async putLanguageData(testData: TestLanguageInputDto[]): Promise<Boolean> {
    const languageInfo: TestLanguageDto[] = [];
    for (const { language: languageName, id: languageCode } of testData) {
      languageInfo.push({
        languageName,
        languageCode,
      });
    }
    await this.languagesRepository.save(languageInfo);
    return true;
  }

  async putStackToLanguageData(
    testData: TestStackToLanguageInputDto[],
  ): Promise<Boolean> {
    const targetSaveData: StackToLanguage[] = [];
    for (const {
      stack: stackName,
      language_id1,
      language_id2,
      language_id3,
      language_id4,
      language_id5,
    } of testData) {
      const stackInfo = await this.techstacksRepository.findOne({
        where: { stackName },
        select: ['id'],
      });
      if (!stackInfo) {
        Logger.log('NOT FOUND STACK');
        Logger.log(stackName);
      }
      const { id: techstackId } = stackInfo;
      if (language_id1 !== '') {
        const targetLanguageData = await this.languagesRepository.findOne({
          languageCode: language_id1,
        });
        if (targetLanguageData) {
          targetSaveData.push(
            this.stackToLanguagesRepository.create({
              techstack: { id: techstackId },
              language: { id: targetLanguageData.id },
            }),
          );
        }
      }
      if (language_id2 !== '') {
        const targetLanguageData = await this.languagesRepository.findOne({
          languageCode: language_id2,
        });
        if (targetLanguageData) {
          targetSaveData.push(
            this.stackToLanguagesRepository.create({
              techstack: { id: techstackId },
              language: { id: targetLanguageData.id },
            }),
          );
        }
      }
      if (language_id3 !== '') {
        const targetLanguageData = await this.languagesRepository.findOne({
          languageCode: language_id3,
        });
        if (targetLanguageData) {
          targetSaveData.push(
            this.stackToLanguagesRepository.create({
              techstack: { id: techstackId },
              language: { id: targetLanguageData.id },
            }),
          );
        }
      }
      if (language_id4 !== '') {
        const targetLanguageData = await this.languagesRepository.findOne({
          id: language_id4,
        });
        if (targetLanguageData) {
          targetSaveData.push(
            this.stackToLanguagesRepository.create({
              techstack: { id: techstackId },
              language: { id: targetLanguageData.id },
            }),
          );
        }
      }
      if (language_id5 !== '') {
        const targetLanguageData = await this.languagesRepository.findOne({
          languageCode: language_id5,
        });
        if (targetLanguageData) {
          targetSaveData.push(
            this.stackToLanguagesRepository.create({
              techstack: { id: techstackId },
              language: { id: targetLanguageData.id },
            }),
          );
        }
      }
    }
    await this.stackToLanguagesRepository.save(targetSaveData);
    return true;
  }

  async putTrendStackData(testData: any): Promise<Boolean> {
    const inputTasks: string[] = Object.keys(testData);
    for (const taskCode of inputTasks) {
      const inputStacks = Object.keys(testData[taskCode]);
      const { id: taskId } = await this.tasksRepository.findOne({
        where: { taskCode },
        select: ['id'],
      });
      let priority = 1;
      for (const stackName of inputStacks) {
        const stackSearchResult = await this.searchByName(stackName);
        let techStackId;
        if (!stackSearchResult) {
          const validateResult = this.validateStackName(stackName);
          if (validateResult == false) {
            // TrendStack 삽입 불가 stack 데이터
            continue;
          } else {
            // ILIKE 검색으로 DB에서 스택 검색은 되지 않았으나, 연결 가능한 스택의 경우
            const { id } = await this.techstacksRepository.findOne({
              where: { stackCode: validateResult },
              select: ['id'],
            });
            techStackId = id;
          }
        } else {
          techStackId = stackSearchResult.id;
        }
        await this.trendStacksRepository.save({
          priority,
          techstack: { id: techStackId },
          task: { id: taskId },
        });
        priority++;
      }
    }
    return true;
  }

  convertWantedToSaramin(inputCode: string): string {
    const setting = {
      '878': '1',
      '961': '1',
      '962': '1',
      '960': '1',
      '897': '1',
      '1026': '2',
      '877': '2',
      '1024': '3',
      '655': '4',
      '1025': '4',
      '1022': '4',
      '872': '5',
      '895': '5',
      '893': '5',
      '894': '5',
      '1027': '6',
      '677': '7',
      '678': '7',
      '10111': '7',
      '873': '8',
      '876': '9',
      '10110': '10',
      '671': '11',
      '939': '12',
      '669': '13',
      '898': '13',
      '958': '15',
      '676': '18',
      '674': '20',
      '1634': '22',
      '665': '25',
      '672': '26',
      '658': '27',
      '661': '28',
    };
    return setting[inputCode];
  }

  validateStackName(inputStack: string): string | false {
    const validateSet = {
      d: false,
      c: '206',
      qa: false,
      api: false,
      web: false,
      ai: false,
      ml: false,
      cloud: false,
      restful: false,
      nft: false,
      nodejs: '258',
      dapp: false,
      ui: false,
      po: false,
      b: false,
      ux: false,
      isms: false,
      p: false,
      iso: false,
      office: false,
      ms: false,
      jira: false,
      istqb: false,
      csts: false,
      devops: false,
      sw: false,
      mcu: false,
      application: false,
      design: false,
      w: false,
      iot: false,
      learning: false,
      '.net': '199',
    };
    return validateSet[inputStack] ?? false;
  }

  async searchByName(stackName: string): Promise<Techstack> | null {
    try {
      const rtnTechstack = await this.techstacksRepository.findOne({
        where: `"stackName" ILIKE '${stackName}'`,
      });
      return rtnTechstack;
    } catch {
      return null;
    }
  }

  async putExtraTrendStackData(testData: any): Promise<Boolean> {
    const insertData = [];
    for (const { taskId, techstackId, num } of testData) {
      insertData.push(
        this.trendStacksRepository.create({
          task: { id: taskId },
          techstack: { id: techstackId },
          priority: num,
        }),
      );
    }
    const result = await this.trendStacksRepository.insert(insertData);
    if (!result) return false;
    return true;
  }
}
