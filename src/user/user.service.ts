import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        gitUserId: createAccountInput.gitUserId,
      });
      if (exists) throw new ConflictException('이미 존재하는 유저입니다.');

      const {
        id: userId,
        gitUserId,
        profileUrl,
        username,
      } = await this.users.save(this.users.create(createAccountInput));
      return {
        newUser: true,
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
