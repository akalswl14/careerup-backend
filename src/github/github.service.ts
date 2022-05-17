import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as UserRepository from 'src/entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { repositoryDto, repositoryThumbnailDto } from 'src/dto/github.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/entities/user.entity';

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(UserRepository.Repository)
    private readonly userRepoRepository: Repository<UserRepository.Repository>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async getGitRepository(username: string) {
    const responseData = await lastValueFrom(
      this.httpService.get(`https://api.github.com/users/${username}/repos`, {
        method: 'GET',
        headers: { accept: 'application/vnd.github.v3+json' },
        params: { sort: 'updated', direction: 'desc', per_page: 10, page: 1 },
      }),
    );
    // if(!responseData || !responseData.data) throw new NotFoundException('Repository 정보를 가져올 수 없습니다.')
    return responseData.data;
  }

  async getUserRepository(userId: string): Promise<repositoryThumbnailDto[]> {
    const rtnRepositories: repositoryThumbnailDto[] = [];
    const userRepoGitIds: string[] = [];

    const userInfo = await this.usersRepository.findOne(userId);
    if (!userInfo) throw new NotFoundException('조회할 수 없는 유저 입니다.');
    const { username } = userInfo;
    const selectedUserRepos = await this.userRepoRepository.find({
      where: { user: { id: userId } },
      order: { id: 'ASC' },
    });
    for (const { gitRepoId, repoName } of selectedUserRepos) {
      userRepoGitIds.push(gitRepoId);
      const html_url = `${username}/${repoName}`;
      rtnRepositories.push({
        gitRepoId,
        repoName,
        html_url,
        isSelect: true,
      });
    }

    const gitRepoResult = await this.getGitRepository(username);

    for (const { id, full_name, html_url } of gitRepoResult) {
      if (userRepoGitIds.includes(id)) continue;
      rtnRepositories.push({
        gitRepoId: id,
        repoName: full_name,
        html_url,
        isSelect: false,
      });
    }
    return rtnRepositories;
  }

  async updateUserRepository(
    userId: string,
    data: repositoryDto[],
  ): Promise<UserRepository.Repository[]> {
    await this.userRepoRepository.delete({ user: { id: userId } });

    const newRepoEntities = data.map(({ gitRepoId, repoName }) =>
      this.userRepoRepository.create({
        gitRepoId,
        repoName,
        user: { id: userId },
      }),
    );

    return this.userRepoRepository.save(newRepoEntities);
  }
}
