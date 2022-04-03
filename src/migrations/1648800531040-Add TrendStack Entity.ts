import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTrendStackEntity1648800531040 implements MigrationInterface {
    name = 'AddTrendStackEntity1648800531040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trend_stack" ("id" BIGSERIAL NOT NULL, "priority" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" bigint NOT NULL, "techstackId" bigint NOT NULL, CONSTRAINT "PK_e78af9e22c8e11d0aaf543ff1f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trend_stack" ADD CONSTRAINT "FK_77588b3fceea829da5ddbd93256" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trend_stack" ADD CONSTRAINT "FK_6b7493dc3062fe85d0496f578ef" FOREIGN KEY ("techstackId") REFERENCES "techstack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trend_stack" DROP CONSTRAINT "FK_6b7493dc3062fe85d0496f578ef"`);
        await queryRunner.query(`ALTER TABLE "trend_stack" DROP CONSTRAINT "FK_77588b3fceea829da5ddbd93256"`);
        await queryRunner.query(`DROP TABLE "trend_stack"`);
    }

}
