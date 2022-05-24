import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { systemSecret } from 'src/middleware/constants';

@ApiTags('테스트 데이터 삽입 API')
@ApiBearerAuth()
@Controller('testdata')
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
  @UseGuards(AuthGuard('jwt'))
  async putRecruitData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestRecruitInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putRecruitData(inputData);
    } else {
      return false;
    }
  }

  @Post('connectrecruit')
  @ApiOperation({
    summary: '공고 데이터 연결 API',
    description:
      '주어진 공고 데이터에 해당하는 Task와 Stack을 연결함. 현재는 타 API 서버 이용을 권장함.',
  })
  @ApiBody({
    type: 'json',
    description: '공고 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  @UseGuards(AuthGuard('jwt'))
  async connectRecruitData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestRecruitInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.connectRecruitData(inputData);
    } else {
      return false;
    }
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
  @UseGuards(AuthGuard('jwt'))
  async putTaskData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestTaskInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putTaskData(inputData);
    } else {
      return false;
    }
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
  @UseGuards(AuthGuard('jwt'))
  async putStackData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestStackInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putStackData(inputData);
    } else {
      return false;
    }
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
  @UseGuards(AuthGuard('jwt'))
  async putLanguageData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestLanguageInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putLanguageData(inputData);
    } else {
      return false;
    }
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
  @UseGuards(AuthGuard('jwt'))
  async putStackToLanguageData(
    @Req() { user: { userId } },
    @Body() { inputData }: { inputData: TestStackToLanguageInputDto[] },
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putStackToLanguageData(inputData);
    } else {
      return false;
    }
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
  @UseGuards(AuthGuard('jwt'))
  async putTrendStackData(
    @Req() { user: { userId } },
    @Body() inputData: any,
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putTrendStackData(inputData);
    } else {
      return false;
    }
  }

  @Post('extratrendstack')
  @ApiOperation({
    summary: 'TrendStack 추가 매뉴얼 데이터 삽입 API',
    description: '매뉴얼적으로 추가한 TrendStack 데이터를 삽입함',
  })
  @ApiBody({
    type: 'json',
    description: 'Task 별 연관 Stack 추가 데이터',
  })
  @ApiOkResponse({
    description: '성공일 경우 True, 실패일 경우 False',
    type: Boolean,
  })
  @UseGuards(AuthGuard('jwt'))
  async putExtraTrendStackData(
    @Req() { user: { userId } },
    @Body() inputData: any,
  ): Promise<Boolean> {
    if (userId == systemSecret) {
      return this.testDataService.putExtraTrendStackData(inputData);
    } else {
      return false;
    }
  }
}
