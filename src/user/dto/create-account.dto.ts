import { OmitType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/dto/output.dto';
import { User } from 'src/entities/user.entity';

export class CreateAccountInput extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class CreateAccountOutput {
  newUser: boolean;
  userId: bigint;
  gitUserId: bigint;
  profileUrl: string;
  username: string;
}
