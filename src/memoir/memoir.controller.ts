import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { inputMemoirDto, memoirThumbnail } from 'src/dto/memoir.dto';
import { MemoirService } from './memoir.service';

@ApiTags('memoir 정보 API')
@ApiBearerAuth()
@Controller('memoir')
export class MemoirController {
  constructor(private readonly memoirsService: MemoirService) {}

  @Get('')
  @ApiOperation({
    summary: '유저 memoir 목록 반환 API',
    description: '회고록 Memoir 목록페이지의 회고록 목록을 반환함.',
  })
  @ApiOkResponse({
    description: '유저의 회고록 Memoir 목록을 반환함',
    type: memoirThumbnail,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getMemoirs(@Req() { user: { userId } }): Promise<memoirThumbnail[]> {
    return this.memoirsService.getMemoirs(userId);
  }

  @Post('')
  @ApiOperation({
    summary: '회고록 반영 ( 수정 / 생성 ) API',
    description: '회고록을 수정, 생성함',
  })
  @ApiBody({
    type: inputMemoirDto,
    description:
      '반영할 회고록 Memoir 정보.\n회고록을 새로 생성하는 경우, monthlyReportId가 주어져야하고, 수정하는 경우에는 id (memoirId)가 주어져야합니다.',
  })
  @ApiCreatedResponse({
    type: Boolean,
    description: '성공적으로 반영됨. ',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateMemoir(
    @Req() { user: { userId } },
    @Body('inputMemoir') inputMemoir: inputMemoirDto,
  ): Promise<Boolean> {
    return this.memoirsService.updateMemoir(userId, inputMemoir);
  }
}
