import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { searchOptionDto } from 'src/dto/output.dto';
import { Techstack } from 'src/entities/techstack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechstackService {
  constructor(
    @InjectRepository(Techstack)
    private readonly techstacksRepository: Repository<Techstack>,
  ) {}

  async getSearchTechStack(): Promise<searchOptionDto[]> {
    const taskResult = await this.techstacksRepository.find({
      select: ['id', 'stackName'],
      order: { id: 'ASC' },
    });
    return taskResult.map(({ id, stackName }) => ({
      id,
      optionName: stackName,
      type: 1,
    }));
  }
}
