import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { searchOptionDto } from 'src/dto/output.dto';
import { TechstackService } from './techstack.service';

@ApiTags('기술스택 API')
@Controller('techstack')
export class TechstackController {
  constructor(private readonly techstackService: TechstackService) {}

  @Get('search')
  @ApiOperation({
    summary: '검색 Techstack 옵션 목록 API',
    description: '검색 페이지에서, 선택할 Techstack 목록을 반환한다.',
  })
  @ApiOkResponse({
    description: '희망 직무로 선택한 Techstack 목록을 반환한다. ',
    type: searchOptionDto,
    isArray: true,
  })
  async getSearchTask(): Promise<searchOptionDto[]> {
    return this.techstackService.getSearchTechStack();
  }
}
