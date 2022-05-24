import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Techstack } from 'src/entities/techstack.entity';
import { TechstackController } from './techstack.controller';
import { TechstackService } from './techstack.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Techstack])],
  controllers: [TechstackController],
  providers: [TechstackService],
})
export class TechstackModule {}
