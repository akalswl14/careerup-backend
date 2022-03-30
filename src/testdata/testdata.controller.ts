import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  TestLanguageInputDto,
  TestRecruitInputDto,
  TestStackInputDto,
  TestStackToLanguageInputDto,
  TestTaskInputDto,
} from 'src/dto/testdata.dto';
import { TestdataService } from './testdata.service';

@Controller('testdata')
export class TestdataController {
  constructor(private readonly testDataService: TestdataService) {}

  @Get('recruit')
  async putRecruitData(
    @Body() testData: TestRecruitInputDto[],
  ): Promise<Boolean> {
    return this.testDataService.putRecruitData(testData);
  }

  @Post('task')
  async putTaskData(
    @Body() { inputData }: { inputData: TestTaskInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putTaskData(inputData);
  }

  @Post('stack')
  async putStackData(
    @Body() { inputData }: { inputData: TestStackInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putStackData(inputData);
  }

  @Post('language')
  async putLanguageData(
    @Body() { inputData }: { inputData: TestLanguageInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putLanguageData(inputData);
  }

  @Post('stacktolanguage')
  async putStackToLanguageData(
    @Body() { inputData }: { inputData: TestStackToLanguageInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putStackToLanguageData(inputData);
  }
}
