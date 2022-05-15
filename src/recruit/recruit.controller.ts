import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecruitService } from './recruit.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { recruitThumbnailDto } from 'src/dto/recruit.dto';
import { Pagination, PaginationOption } from 'src/paginate';

@ApiBearerAuth()
@Controller('recruit')
@ApiTags('공고 API')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Get('today')
  @ApiOperation({
    summary: '오늘의 공고 API',
    description:
      '서비스 메인 화면 내 오늘의 공고 정보를 반환한다.\n반환 공고는 7일 내의 공고 & dueDate가 null 이거나 오늘 이후인 공고로 제한함.\nRepository 분석결과 생성 후의 경우는 아직 개발되지 않음.',
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    isArray: false,
    required: false,
    description: '페이지네이션을 위한 take 값. Default = 10',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    isArray: false,
    required: false,
    description: '페이지네이션을 위한 page 값. Default = 1',
  })
  @ApiOkResponse({
    description:
      '조회한 오늘의 공고를 반환한다. \n\nRepository 분석결과 생성 전일 경우, 유저의 관심 직무를 가진 Recruit를 DB에 추가된 최신순, dueDate가 임박한 순 ( null 의 경우 마지막의 순서로 )를 가지는 순서 알고리즘으로 반환함.\nRepository 분석결과 생성 후일 경우, 유저의 관심 직무와 Repository 분석한 주언어를 가진 Recruit를 1순위로 유저의 관심 직무를 가진 Recruit를 2순위로하는 알고리즘으로 반환함.( 알고리즘 내 Recruit 순서는 위와 동일)',
    type: recruitThumbnailDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getTodayRecruits(
    @Req() { user: { userId } },
    @Query() { take = 10, page = 1 }: PaginationOption,
  ): Promise<Pagination<recruitThumbnailDto>> {
    return this.recruitService.getTodayRecruits({ take, page }, userId);
  }

  @Post('wish')
  @ApiOperation({
    summary: '공고 찜 API',
    description: '공고에 대해 찜 등록 혹은 찜 해제를 수행함.',
  })
  @ApiQuery({
    name: 'id',
    type: 'number',
    isArray: false,
    required: true,
    description: '찜 등록 / 해제할 공고 ID',
  })
  @ApiOkResponse({
    description: '찜 등록시 true, 해제시 false를 반환함.',
    type: 'boolean',
    isArray: false,
  })
  @UseGuards(AuthGuard('jwt'))
  async toggleWishRecruit(
    @Req() { user: { userId } },
    @Query() { id: recruitId }: { id: string },
  ): Promise<Boolean> {
    return this.recruitService.toggleWishRecruit(recruitId, userId);
  }

  @Get('recommend')
  @ApiOperation({
    summary: '분석 결과 추천 공고 API',
    description:
      '서비스 메인 화면 내 분석 결과 추천 공고 정보를 반환한다.\n반환 공고는 7일 내의 공고 & dueDate가 null 이거나 오늘 이후인 공고로 제한함.\n오늘의 공고와 중복되지 않도록하는 처리는 아직 개발되지 않음.(즉, 오늘의 공고와 중복될 수 있음)',
  })
  @ApiOkResponse({
    description:
      '조회한 분석 결과 추천 공고를 반환한다. 기본 알고리즘은 다음과 같다. \n\n1. 사용자의 관심직무 1순위 + 트렌드 분석결과에 따른 해당 연관 스택 1위\n2.사용자의 관심직무 1순위 + 트렌드 분석결과에 따른 해당 연관 스택 2위\n3.사용자의 관심직무 1순위 + 트렌드 분석결과에 따른 해당 연관 스택 3위',
    type: recruitThumbnailDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async getRecommendRecruits(
    @Req() { user: { userId } },
  ): Promise<recruitThumbnailDto[]> {
    return this.recruitService.getRecommendRecruits(userId);
  }
}
