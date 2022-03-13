import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GithubLoginInputDto,
  GithubLoginOutputDto,
} from 'src/dto/github-login-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async githubSignUp(user: GithubLoginInputDto): Promise<GithubLoginOutputDto> {
    const gitUserId = user.gitUserId.toString();
    const foundGithub = await this.usersRepository.findOne({
      where: { gitUserId },
      select: ['id', 'email', 'username', 'profileUrl'],
    });

    if (foundGithub) {
      const { id, username, profileUrl } = foundGithub;
      return { id, gitUserId, username, profileUrl };
    }

    const { id, username, profileUrl } = await this.usersRepository.save({
      gitUserId,
      email: user.email,
      profileUrl: user.profileUrl,
      username: user.username,
    });
    return { id, gitUserId, username, profileUrl };
  }

  async signToken(user) {
    try {
      const payload = { sub: user.id };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (e) {
      throw new ConflictException('로그인이 불가한 유저입니다.');
    }
  }

  async githubLogin(req) {
    if (!req.user) throw new ConflictException('유효하지 않은 유저');

    const gitUserId = req.user.gitUserId.toString();
    const foundGithub = await this.usersRepository.findOne({
      where: { gitUserId },
      select: ['id', 'email', 'username', 'profileUrl'],
    });
    var userId: string;
    if (foundGithub) {
      var { id: userId } = foundGithub;
      await this.usersRepository.update(
        { id: userId },
        { gitAccessToken: req.user.gitAccessToken },
      );
    } else {
      var { id: userId } = await this.usersRepository.save({
        gitUserId,
        email: req.user.email,
        profileUrl: req.user.profileUrl,
        username: req.user.username,
        gitAccessToken: req.user.gitAccessToken,
      });
    }

    return {
      accessToken: this.jwtService.sign({ sub: userId }),
    };
  }
}
