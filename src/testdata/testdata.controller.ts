import { Body, Controller, Post } from '@nestjs/common';
import {
  TestLanguageInputDto,
  TestRecruitInputDto,
  TestStackInputDto,
  TestStackToLanguageInputDto,
  TestTaskInputDto,
} from 'src/dto/testdata.dto';
import { TestdataService } from './testdata.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('testdata')
@ApiTags('테스트 데이터 삽입 API')
export class TestdataController {
  constructor(private readonly testDataService: TestdataService) {}

  @Post('recruit')
  @ApiOperation({
    summary: '공고 삽입 API',
    description: '주어진 공고 데이터 삽입함. 현재는 타 API 서버 이용을 권장함.',
  })
  @ApiBody({
    type: 'json',
    description: '공고 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putRecruitData(
    @Body() { inputData }: { inputData: TestRecruitInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putRecruitData(inputData);
  }

  @Post('connectrecruit')
  @ApiOperation({
    summary: '공고 데이터 연결 API',
    description: '주어진 공고 데이터에 해당하는 Task와 Stack을 연결함.',
  })
  @ApiBody({
    type: 'json',
    description: '공고 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async connectRecruitData(
    @Body() { inputData }: { inputData: TestRecruitInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.connectRecruitData(inputData);
  }

  @Post('task')
  @ApiOperation({
    summary: 'Task 삽입 API',
    description: '주어진 Task 테스트 데이터를 삽입함.',
  })
  @ApiBody({
    type: 'json',
    description: 'task 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putTaskData(
    @Body() { inputData }: { inputData: TestTaskInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putTaskData(inputData);
  }

  @Post('stack')
  @ApiOperation({
    summary: 'Stack 삽입 API',
    description: '주어진 Stack 데이터를 삽입함.',
  })
  @ApiBody({
    type: 'json',
    description: 'Stack 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putStackData(
    @Body() { inputData }: { inputData: TestStackInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putStackData(inputData);
  }

  @Post('language')
  @ApiOperation({
    summary: 'Language 삽입 API',
    description: 'Language 데이터를 삽입함.',
  })
  @ApiBody({
    type: 'json',
    description: 'Language 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putLanguageData(
    @Body() { inputData }: { inputData: TestLanguageInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putLanguageData(inputData);
  }

  @Post('stacktolanguage')
  @ApiOperation({
    summary: 'Stack과 Language 연결 API',
    description: '주어진 Stack-Language 쌍에 따라 데이터를 연결함.',
  })
  @ApiBody({
    type: 'json',
    description:
      '{ id:stackId, language:languageId } 의 구조를 가지는 Stack-Language 데이터 쌍',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putStackToLanguageData(
    @Body() { inputData }: { inputData: TestStackToLanguageInputDto[] },
  ): Promise<Boolean> {
    return this.testDataService.putStackToLanguageData(inputData);
  }

  @Post('trendstack')
  @ApiOperation({
    summary: 'TrendStack 데이터 삽입 API',
    description: 'TrendStack 데이터를 삽입함',
  })
  @ApiBody({
    type: 'json',
    description: 'Task 별 연관 Stack 결과',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  async putTrendStackData(@Body() inputData: any): Promise<Boolean> {
    return this.testDataService.putTrendStackData(inputData);
  }
}
