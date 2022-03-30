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

@Entity()
export class TestRecruitInputDto {
  recruitTitle: string;
  companyName: string;
  recruitCareer: string;
  recruitSchool: string;
  recruitCondition: string;
  recruitLocation: string;
  recruitCode: string;
  dueDate: string;
  reg: string;
  task: string[];
  stack: string[];
}

@Entity()
export class TestTaskDto {
  taskName: string;
  taskCode: string;
  isDuplicate: boolean;
}

@Entity()
export class TestTaskInputDto {
  task: string;
  code1: string;
  code2: string;
  code3: string;
}

@Entity()
export class TestStackDto {
  stackName: string;
  stackCode: string;
}

@Entity()
export class TestStackInputDto {
  stack: string;
  code1: string;
}

@Entity()
export class TestLanguageDto {
  languageName: string;
  languageCode: string;
}

@Entity()
export class TestLanguageInputDto {
  language: string;
  id: string;
}

@Entity()
export class TestStackToLanguageDto {
  id: string;
}

@Entity()
export class TestStackToLanguageInputDto {
  stack: string;
  language_id1: string;
  language_id2: string;
  language_id3: string;
  language_id4: string;
  language_id5: string;
}
