import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

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
