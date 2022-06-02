import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { userLoginDto } from 'src/dto/auth.dto';
import { LoginInfo } from 'src/entities/login-info.entity';
import { OauthInfo } from 'src/entities/oauth-info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(OauthInfo)
    private oauthInfosRepository: Repository<OauthInfo>,
    @InjectRepository(LoginInfo)
    private loginInfosRepository: Repository<LoginInfo>,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async githubLogin(req): Promise<{ accessToken: string }> {
    if (!req.user) throw new ConflictException('유효하지 않은 유저');

    const gitUserId = req.user.gitUserId.toString();
    const gitAccessToken = req.user.gitAccessToken;
    const foundGithub = await this.usersRepository.findOne({
      where: { gitUserId },
      select: ['id', 'email', 'username', 'profileUrl'],
    });

    const GITHUB = 'Github';
    var userId: string;
    if (foundGithub) {
      var { id: userId } = foundGithub;
      await this.oauthInfosRepository.delete({
        user: { id: userId },
        provider: GITHUB,
      });
    } else {
      var { id: userId } = await this.usersRepository.save({
        gitUserId,
        email: req.user.email,
        profileUrl: req.user.profileUrl,
        username: req.user.username,
      });
    }

    await this.oauthInfosRepository.save({
      user: { id: userId },
      accessToken: gitAccessToken,
      provider: GITHUB,
    });
    const userAccessToken = this.jwtService.sign({ sub: userId });
    await this.usersRepository.update({ id: userId }, { userAccessToken });
    await this.loginInfosRepository.save({
      user: { id: userId },
      loginSuccess: true,
    });

    return {
      accessToken: userAccessToken,
    };
  }

  async loginUser({ userGitToken }): Promise<userLoginDto> {
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github.v3+json',
          Authorization: `token ${userGitToken}`,
        },
      }),
    );
    if (!responseData || !responseData.data)
      throw new NotFoundException('유효하지 않는 Github 유저입니다.');

    const {
      id: gitUserId,
      avatar_url,
      email,
      login: username,
    } = responseData.data;
    const foundGithub = await this.usersRepository.findOne({
      where: { gitUserId },
      select: ['id'],
    });

    const GITHUB = 'Github';
    var userId: string;
    if (foundGithub) {
      var { id: userId } = foundGithub;
      await this.oauthInfosRepository.delete({
        user: { id: userId },
        provider: GITHUB,
      });
    } else {
      var { id: userId } = await this.usersRepository.save({
        gitUserId,
        email,
        profileUrl: avatar_url,
        username,
      });
    }

    await this.oauthInfosRepository.save({
      user: { id: userId },
      accessToken: userGitToken,
      provider: GITHUB,
    });
    const userAccessToken = this.jwtService.sign({ sub: userId });
    await this.usersRepository.update({ id: userId }, { userAccessToken });
    await this.loginInfosRepository.save({
      user: { id: userId },
      loginSuccess: true,
    });

    return {
      accessToken: userAccessToken,
      isNewUser: foundGithub ? false : true,
    };
  }
}
