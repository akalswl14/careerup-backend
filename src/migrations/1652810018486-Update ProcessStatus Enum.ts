import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProcessStatusEnum1652810018486 implements MigrationInterface {
    name = 'UpdateProcessStatusEnum1652810018486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."portfolio_log_portfoliostatus_enum" RENAME TO "portfolio_log_portfoliostatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."portfolio_log_portfoliostatus_enum" AS ENUM('request', 'start', 'onprogress', 'success', 'fail')`);
        await queryRunner.query(`ALTER TABLE "portfolio_log" ALTER COLUMN "portfolioStatus" TYPE "public"."portfolio_log_portfoliostatus_enum" USING "portfolioStatus"::"text"::"public"."portfolio_log_portfoliostatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."portfolio_log_portfoliostatus_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."report_log_reportstatus_enum" RENAME TO "report_log_reportstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."report_log_reportstatus_enum" AS ENUM('request', 'start', 'onprogress', 'success', 'fail')`);
        await queryRunner.query(`ALTER TABLE "report_log" ALTER COLUMN "reportStatus" TYPE "public"."report_log_reportstatus_enum" USING "reportStatus"::"text"::"public"."report_log_reportstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."report_log_reportstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."report_log_reportstatus_enum_old" AS ENUM('start', 'onprogress', 'success', 'fail')`);
        await queryRunner.query(`ALTER TABLE "report_log" ALTER COLUMN "reportStatus" TYPE "public"."report_log_reportstatus_enum_old" USING "reportStatus"::"text"::"public"."report_log_reportstatus_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."report_log_reportstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."report_log_reportstatus_enum_old" RENAME TO "report_log_reportstatus_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."portfolio_log_portfoliostatus_enum_old" AS ENUM('start', 'onprogress', 'success', 'fail')`);
        await queryRunner.query(`ALTER TABLE "portfolio_log" ALTER COLUMN "portfolioStatus" TYPE "public"."portfolio_log_portfoliostatus_enum_old" USING "portfolioStatus"::"text"::"public"."portfolio_log_portfoliostatus_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."portfolio_log_portfoliostatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."portfolio_log_portfoliostatus_enum_old" RENAME TO "portfolio_log_portfoliostatus_enum"`);
    }

}
