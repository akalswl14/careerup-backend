import {MigrationInterface, QueryRunner} from "typeorm";

export class FixCommitDetailColumnOnMonthlyReportEntity1653283734640 implements MigrationInterface {
    name = 'FixCommitDetailColumnOnMonthlyReportEntity1653283734640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "commitDetail"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "commitDetail" integer array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "commitDetail"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "commitDetail" json NOT NULL`);
    }

}
