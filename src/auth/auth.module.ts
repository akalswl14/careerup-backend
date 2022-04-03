import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginInfo } from 'src/entities/login-info.entity';
import { OauthInfo } from 'src/entities/oauth-info.entity';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from '../middleware/github.strategy';
import { jwtConstants } from '../middleware/constants';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, OauthInfo, LoginInfo]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}
