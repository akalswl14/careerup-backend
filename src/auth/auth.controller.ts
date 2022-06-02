import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req) {
    return this.authSerivce.githubLogin(req);
  }

  @Post('login')
  @ApiOperation({
    summary: 'APP의 github Login을 통한 회원가입 혹은 로그인',
    description:
      'APP에서의 Github Login에 따라, 새로운 유저를 생성하거나, 기존의 유저를 조회해 그 여부와 토큰을 반환한다.',
  })
  @ApiBody({
    type: 'string',
    description: '{userGitToken:string}의 형식으로 github에서 반환한',
    isArray: true,
  })
  @ApiCreatedResponse({
    description: '성공적으로 반영됨. ',
  })
  async login(@Body('userGitToken') userGitToken: string) {
    return this.authSerivce.loginUser({ userGitToken });
  }
}
