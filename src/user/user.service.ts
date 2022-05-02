import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const exists = await this.usersRepository.findOne({
        gitUserId: createAccountInput.gitUserId,
      });
      if (exists) throw new ConflictException('이미 존재하는 유저입니다.');

      const {
        id: userId,
        gitUserId,
        profileUrl,
        username,
      } = await this.usersRepository.save(
        this.usersRepository.create(createAccountInput),
      );
      return {
        userId,
        gitUserId,
        profileUrl,
        username,
      };
    } catch (e) {
      throw e;
    }
  }
}
