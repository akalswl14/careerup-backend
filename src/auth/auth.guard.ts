import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      // 클라이언트에서 보낸 request 정보 읽어오기
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }
}
