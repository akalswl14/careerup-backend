import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsOnMonthlyReport1653205177579 implements MigrationInterface {
    name = 'AddColumnsOnMonthlyReport1653205177579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "stackTask"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "stackId" bigint`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "stackTaskId" bigint`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "stackTaskName" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "stackTaskName"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "stackTaskId"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" DROP COLUMN "stackId"`);
        await queryRunner.query(`ALTER TABLE "monthly_report" ADD "stackTask" character varying(255)`);
    }

}
