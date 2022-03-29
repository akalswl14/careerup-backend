import { Recruit } from 'src/entities/recruit.entity';
import { Task } from 'src/entities/task.entity';
import { Techstack } from 'src/entities/techstack.entity';
import { Entity } from 'typeorm';

@Entity()
export class TestRecruitDto {
  recruitTitle: string;
  companyName: string;
  recruitCareer: string;
  recruitSchool: string;
  recruitCondition: string;
  recruitLocation: string;
  recruitCode: string;
  dueDate?: Date;
  dueType: number;
  tasks: { taskCode: string }[];
  techstacks: { stackCode: string }[];
}
