import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTechstackToLanguageAutomaticallyGenerateJointable1653189838764
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "techstack_languages_language"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
