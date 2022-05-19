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
import {
  reportLogDto,
  repositoryDto,
  repositoryThumbnailDto,
} from 'src/dto/github.dto';
import { Repository } from 'src/entities/repository.entity';
import { GithubService } from './github.service';

@ApiTags('github 정보 API')
@ApiBearerAuth()
@Controller('github')
export class GithubController {
  constructor(private readonly githubsService: GithubService) {}

  @Get('repository')
  @ApiOperation({
    summary: '유저 repository 반환 API',
    description: 'Repository 선택 페이지의, github Repository 목록을 반환함.',
  })
  @ApiOkResponse({
    description:
      '유저의 선택 여부가 함께 반영된 github Repository 목록을 반환함. ',
    type: repositoryThumbnailDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getUserRepository(
    @Req() { user: { userId } },
  ): Promise<repositoryThumbnailDto[]> {
    return this.githubsService.getUserRepository(userId);
  }

  @Post('repository')
  @ApiOperation({
    summary: '유저 Repository 선택 반영 API',
    description:
      '유저의 Repository 선택을 반영한다.\n이번 달에, 분석 기록이 없다면 내부적으로 분석 실행 준비 상태가 된다.',
  })
  @ApiBody({
    type: repositoryDto,
    description: '유저가 선택한 Repository 정보',
    isArray: true,
  })
  @ApiCreatedResponse({
    description: '성공적으로 반영됨. ',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateUserRepository(
    @Req() { user: { userId } },
    @Body('inputRepository') inputRepository: repositoryDto[],
  ): Promise<Repository[]> {
    return this.githubsService.updateUserRepository(userId, inputRepository);
  }

  @Post('report/manual')
  @ApiOperation({
    summary: '요청된 분석 결과 생성 API',
    description:
      'report_log에 REQUET 상태인, 직접 분석 요청된 건에 대해 분석을 실행한다.\n해당 권한에 대한 토큰이 필요하다.(토큰 아직 미적용)',
  })
  @UseGuards(AuthGuard('jwt'))
  async createManualReport(
    @Req() { user: { userId } },
  ): // ): Promise<reportLogDto[]> {
  Promise<any[]> {
    return this.githubsService.createManualReport();
  }

  // async getMonthlyReport(@Req() {user:{userId}}){
  //   return {reportStatus:enum,data:{}}
  // }
}
