import { Module } from '@nestjs/common';
import { TechstackController } from './techstack.controller';
import { TechstackService } from './techstack.service';

@Module({
  controllers: [TechstackController],
  providers: [TechstackService],
})
export class TechstackModule {}
