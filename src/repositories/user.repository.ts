import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkGitId(gitUserId: bigint): Promise<bigint> {
    const user = await this.createQueryBuilder()
      .select('user')
      .where('user.gitUserId = :gitUserId', { gitUserId: gitUserId })
      .getOne();
    return user.gitUserId;
  }
}
