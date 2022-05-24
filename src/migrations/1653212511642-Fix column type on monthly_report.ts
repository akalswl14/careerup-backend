import {MigrationInterface, QueryRunner} from "typeorm";

export class FixColumnTypeOnMonthlyReport1653212511642 implements MigrationInterface {
    name = 'FixColumnTypeOnMonthlyReport1653212511642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "repoIds"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "repoIds" bigint array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "repoIds"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "repoIds" bigint NOT NULL`);
    }

}
