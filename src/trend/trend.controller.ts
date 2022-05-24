import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { trendTaskDto, trendTaskToStackDto } from 'src/dto/trend.dto';
import { TrendService } from './trend.service';

@ApiTags('트렌드 분석 정보 API')
@Controller('trend')
export class TrendController {
  constructor(private readonly trendInfosService: TrendService) {}

  @Get('task')
  @ApiOperation({
    summary: '트렌드 직무별 공고수',
    description:
      '트렌드 분석 결과 페이지에, 트렌드 직무별 공고수 막대 그래프 뷰를 위한 데이터값을 반환함.',
  })
  @ApiOkResponse({
    description: '트렌드 직무별 공고수 목록을, 공고수 내림차순으로 반환함. ',
    type: trendTaskDto,
    isArray: true,
  })
  async getTrendTask(): Promise<trendTaskDto[]> {
    return this.trendInfosService.getTrendTask();
  }

  @Get('taskdetail/:taskId')
  @ApiOperation({
    summary: '해당 트렌드 직무의 연관 스택과, 세부 연관 스택',
    description:
      '트렌드 분석 결과 페이지에서 클릭한, 해당 트렌드 직무의 연관 스택과, 그 연관 스택의 연관 스택 데이터값을 반환함.',
  })
  @ApiOkResponse({
    description: '해당 트렌드 직무의 연관 스택과 그 연관 스택의 연관 스택 목록',
    type: trendTaskToStackDto,
    isArray: true,
  })
  @ApiParam({
    name: 'taskId',
    format: 'bigint string',
  })
  async getTrendTaskToStack(
    @Param() { taskId }: { taskId: string },
  ): Promise<trendTaskToStackDto[]> {
    return this.trendInfosService.getTrendTaskToStack(taskId);
  }
}
