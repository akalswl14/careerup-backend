import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createAccount(
    @Body() userData: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(userData);
  }
}
