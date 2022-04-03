import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  setWishTaskDto,
  userWishTaskDto,
  wishTaskOptionDto,
} from 'src/dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('wishtask/option')
  @UseGuards(AuthGuard('jwt'))
  async getWishTaskOption(
    @Req() { user: { userId } },
    @Param('priority') priority: string,
  ): Promise<wishTaskOptionDto[]> {
    return this.taskService.getWishTaskOption({ userId, priority });
  }

  @Post('wishtask')
  @UseGuards(AuthGuard('jwt'))
  async setWishTask(
    @Req() { user: { userId } },
    @Body('wishTask') wishTask: setWishTaskDto[],
  ) {
    return this.taskService.setWishTask({ wishTask, userId });
  }

  @Get('wishtask')
  @UseGuards(AuthGuard('jwt'))
  async getWishTask(@Req() { user: { userId } }): Promise<userWishTaskDto[]> {
    return this.taskService.getWishTask(userId);
  }
}
