import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUpdatedAtColumnOnReportLog1652809790504 implements MigrationInterface {
    name = 'AddUpdatedAtColumnOnReportLog1652809790504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_log" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_log" DROP COLUMN "updatedAt"`);
    }

}
