import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRemainedEntityName1650963548114
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "login_info" RENAME TO "LoginInfo";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "wish_task" RENAME TO "WishTask";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "wish_recruit" RENAME TO "WishRecruit";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "trend_stack" RENAME TO "TrendStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "task_to_stack" RENAME TO "TaskToStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "stack_to_stack" RENAME TO "StackToStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "report_log" RENAME TO "ReportLog";`,
    );
    await queryRunner.query(`DROP TABLE "portfolio_log";`);
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "oauth_info" RENAME TO "OauthInfo";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "monthly_report" RENAME TO "MonthlyReport";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
