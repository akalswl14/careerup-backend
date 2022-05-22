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
  monthlyReportThumbnail,
  reportLogDto,
  repositoryDto,
  repositoryThumbnailDto,
} from 'src/dto/github.dto';
import { ReportLog } from 'src/entities/report-log.entity';
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
  ): Promise<reportLogDto[]> {
    return this.githubsService.createManualReport();
  }
  @Post('report/monthlyrequest')
  @ApiOperation({
    summary: '월별 정기 분석 요청 생성 API',
    description:
      '월별 정기적으로 분석 요청( Request상태의 ReportLog )을 생성한다.\n 단, 해당 월에 분석 결과가 생성된 적이 없거나, 생성되었더라도 success / onprogress 상태가 아닌 경우에 해당되는 유저를 대상으로 생성한다.\n해당 권한에 대한 토큰이 필요하다.(토큰 아직 미적용)',
  })
  @UseGuards(AuthGuard('jwt'))
  async createMonthlyReportRequest(
    @Req() { user: { userId } },
  ): Promise<ReportLog[]> {
    return this.githubsService.createMonthlyReportRequest();
  }

  @Get('report')
  @ApiOperation({
    summary: '유저 monthly report 반환 API',
    description: 'github repository 분석 결과 페이지의 분석 결과를 반환함.',
  })
  @ApiOkResponse({
    description: '현재 분석 상태와, 해당하는 분석 결과값을 반환함.',
    type: monthlyReportThumbnail,
    isArray: false,
  })
  @UseGuards(AuthGuard('jwt'))
  async getMonthlyReport(
    @Req() { user: { userId } },
  ): Promise<monthlyReportThumbnail> {
    return this.githubsService.getMonthlyReport(userId);
  }
}
