import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { searchOptionDto } from 'src/dto/output.dto';
import {
  priorityQueryDto,
  setWishTaskDto,
  userWishTaskDto,
  wishTaskOptionDto,
} from 'src/dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('직무 API')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('wish/option')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 희망 직무 옵션 목록 API',
    description:
      '사용자의 희망 직무 선택 페이지에서, 직무 옵션 목록을 반환한다.',
  })
  @ApiQuery({
    name: 'priority',
    type: 'number',
    isArray: false,
    required: true,
    description: '선택할 희망 직무의 순위',
  })
  @ApiOkResponse({
    description:
      '희망 직무로 선택할 수 있는 Task 목록이며, 이 옵션 중 사용자가 선택 여부 정보를 함께 반환한다. ',
    type: wishTaskOptionDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getWishTaskOption(
    @Req() { user: { userId } },
    @Query() { priority }: priorityQueryDto,
  ): Promise<wishTaskOptionDto[]> {
    return this.taskService.getWishTaskOption({ userId, priority });
  }

  @Post('wish')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 희망 직무 선택 반영 API',
    description:
      '사용자의 희망 직무 선택 페이지에서, 직무 옵션 선택을 반영한다.',
  })
  @ApiBody({
    type: setWishTaskDto,
    description: '사용자 희망 직무 선택 반영 입력값',
    isArray: true,
  })
  @ApiCreatedResponse({
    description: '성공적으로 반영됨. ',
  })
  @UseGuards(AuthGuard('jwt'))
  async setWishTask(
    @Req() { user: { userId } },
    @Body('wishTask') wishTask: string[],
  ) {
    return this.taskService.setWishTask({ wishTask, userId });
  }

  @Get('wish')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 희망 직무 선택값 반환 API',
    description:
      '사용자의 희망 직무 선택 페이지에서, 선택한 희망 직무를 반환한다.',
  })
  @ApiOkResponse({
    description: '희망 직무로 선택한 Task 목록을 반환한다. ',
    type: userWishTaskDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getWishTask(@Req() { user: { userId } }): Promise<userWishTaskDto[]> {
    return this.taskService.getWishTask(userId);
  }

  @Get('search')
  @ApiOperation({
    summary: '검색 Task 옵션 목록 API',
    description: '검색 페이지에서, 선택할 Task 목록을 반환한다.',
  })
  @ApiOkResponse({
    description: '희망 직무로 선택한 Task 목록을 반환한다. ',
    type: searchOptionDto,
    isArray: true,
  })
  async getSearchTask(): Promise<searchOptionDto[]> {
    return this.taskService.getSearchTask();
  }
}
