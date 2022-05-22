import {MigrationInterface, QueryRunner} from "typeorm";

export class FixColumnsOnUserAndMemoirForMemoir1653221785669 implements MigrationInterface {
    name = 'FixColumnsOnUserAndMemoirForMemoir1653221785669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memoir" ADD "userId" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memoir" ADD CONSTRAINT "FK_0dec530064859fcb8fe5fea1d95" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memoir" DROP CONSTRAINT "FK_0dec530064859fcb8fe5fea1d95"`);
        await queryRunner.query(`ALTER TABLE "memoir" DROP COLUMN "userId"`);
    }

}
