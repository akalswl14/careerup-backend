import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { userProfileDto } from 'src/dto/user.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({
    summary: '사용자 프로필 반환 API',
    description: '프로필 페이지의 사용자 프로필 정보를 반환함.',
  })
  @ApiOkResponse({
    description: '프로필 페이지의 사용자 프로필 정보를 반환함.',
    type: userProfileDto,
  })
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Req() { user: { userId } }): Promise<userProfileDto> {
    return this.userService.getUserProfile(userId);
  }
}
