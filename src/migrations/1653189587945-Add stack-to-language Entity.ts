import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStackToLanguageEntity1653189587945 implements MigrationInterface {
    name = 'AddStackToLanguageEntity1653189587945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stack_to_language" ("id" BIGSERIAL NOT NULL, "techstackId" bigint NOT NULL, "languageId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0efa630da21e31bd1877d712868" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stack_to_language" ADD CONSTRAINT "FK_9bb75e5161178437c1de5f2098f" FOREIGN KEY ("techstackId") REFERENCES "techstack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stack_to_language" ADD CONSTRAINT "FK_3cb94e3306ccc74b1787832152b" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stack_to_language" DROP CONSTRAINT "FK_3cb94e3306ccc74b1787832152b"`);
        await queryRunner.query(`ALTER TABLE "stack_to_language" DROP CONSTRAINT "FK_9bb75e5161178437c1de5f2098f"`);
        await queryRunner.query(`DROP TABLE "stack_to_language"`);
    }

}
