import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruit } from 'src/entities/recruit.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { TrendStack } from 'src/entities/trend-stack.entity';
import { User } from 'src/entities/user.entity';
import { WishRecruit } from 'src/entities/wish-recruit.entity';
import { WishTask } from 'src/entities/wish-task.entity';
import { jwtConstants } from 'src/middleware/constants';
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      Recruit,
      Task,
      Techstack,
      WishTask,
      WishRecruit,
      TrendStack,
    ]),
  ],
  controllers: [RecruitController],
  providers: [RecruitService, JwtStrategy],
})
export class RecruitModule {}
