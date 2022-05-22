import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email', 'repo'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, avatar_url, email, login: username } = profile._json;
      const githubUser = {
        gitUserId: +id,
        email: email ?? null,
        profileUrl: avatar_url,
        username,
        gitAccessToken: _accessToken,
      };
      done(null, githubUser);
    } catch (e) {
      done(e);
    }
  }
}
