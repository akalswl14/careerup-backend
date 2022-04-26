import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditEntityName1650962083704 implements MigrationInterface {
  name = 'EditEntityName1650962083704';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "career" RENAME TO "Career";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "language" RENAME TO "Language";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "login-info" RENAME TO "LoginInfo";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "memoir" RENAME TO "Memoir";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "wish-task" RENAME TO "WishTask";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS wish-recruit RENAME TO "WishRecruit";`,
    );
    await queryRunner.query(`ALTER TABLE IF EXISTS "user" RENAME TO "User";`);
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "trend-stack" RENAME TO "TrendStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "techstack" RENAME TO "TechStack";`,
    );
    await queryRunner.query(`ALTER TABLE IF EXISTS "task" RENAME TO "Task";`);
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "task-to-stack" RENAME TO "TaskToStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "stack-to-stack" RENAME TO "StackToStack";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "school" RENAME TO "School";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "repository" RENAME TO "Repository";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "report-log" RENAME TO "ReportLog";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "recruit" RENAME TO "Recruit";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "portfolioLog" RENAME TO "PortfolioLog";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "portfolio" RENAME TO "Portfolio";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "oauth-info" RENAME TO "OauthInfo";`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "monthly-report" RENAME TO "MonthlyReport";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recruit_tasks_task" DROP CONSTRAINT "FK_557c1995bd1c6ed75a6fb28ffcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruit_tasks_task" DROP CONSTRAINT "FK_eb234c3bd7952d66ffdec42e2aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruit_techstacks_tech_stack" DROP CONSTRAINT "FK_f40bb86741364f2052ff83d6db3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruit_techstacks_tech_stack" DROP CONSTRAINT "FK_47b215aae27c5d163342615ac30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tech_stack_languages_language" DROP CONSTRAINT "FK_c6f1ad9d6bc39f5e7bf1c3b8093"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tech_stack_languages_language" DROP CONSTRAINT "FK_9bba4c4eb91766af9388f85cd0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Memoir" DROP CONSTRAINT "FK_1374d6d1919e8306297c63e61eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Career" DROP CONSTRAINT "FK_944b09f145139209cc61ce276e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WistRecruit" DROP CONSTRAINT "FK_f3e7ce078af233a47cbd70145c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WistRecruit" DROP CONSTRAINT "FK_9783062d7cb940d92c51ea11c62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishTask" DROP CONSTRAINT "FK_10d8b004397d7b370f4f2759c3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishTask" DROP CONSTRAINT "FK_d758881455faf775e8a431ee5ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TrendStack" DROP CONSTRAINT "FK_204fddad60be8a95a6450709d6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TrendStack" DROP CONSTRAINT "FK_c85f5bf001525c8b2d9de16f8ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TaskToStack" DROP CONSTRAINT "FK_fed3282cfa2e6d8279929ba9e38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StackToStack" DROP CONSTRAINT "FK_cb22c47f67e5d30ba1e45705b12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonthlyReport" DROP CONSTRAINT "FK_9b1ccfcd3b7bd3f2ace861bdcbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Portfolio" DROP CONSTRAINT "FK_b6253ffcbc28f4bc7c0cdc039e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Repository" DROP CONSTRAINT "FK_9dc7663cee0f31191ac978039b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ReportLog" DROP CONSTRAINT "FK_e7b0fabd2b5216f6033f38bae13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PortfolioLog" DROP CONSTRAINT "FK_f8a5d8d0654f4e5e9e7a0393d53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "School" DROP CONSTRAINT "FK_c7503b0428d6395ff71cfb156f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "LoginInfo" DROP CONSTRAINT "FK_bb3cd06baf389bd8cc910d2b119"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OauthInfo" DROP CONSTRAINT "FK_41c450a95175f9a9a48b9fa346e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f40bb86741364f2052ff83d6db"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_47b215aae27c5d163342615ac3"`,
    );
    await queryRunner.query(`DROP TABLE "recruit_techstacks_tech_stack"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c6f1ad9d6bc39f5e7bf1c3b809"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bba4c4eb91766af9388f85cd0"`,
    );
    await queryRunner.query(`DROP TABLE "tech_stack_languages_language"`);
    await queryRunner.query(`DROP TABLE "Memoir"`);
    await queryRunner.query(`DROP TABLE "Career"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "WistRecruit"`);
    await queryRunner.query(`DROP TABLE "Recruit"`);
    await queryRunner.query(`DROP TABLE "Task"`);
    await queryRunner.query(`DROP TABLE "WishTask"`);
    await queryRunner.query(`DROP TABLE "TrendStack"`);
    await queryRunner.query(`DROP TABLE "TechStack"`);
    await queryRunner.query(`DROP TABLE "Language"`);
    await queryRunner.query(`DROP TABLE "TaskToStack"`);
    await queryRunner.query(`DROP TABLE "StackToStack"`);
    await queryRunner.query(`DROP TABLE "MonthlyReport"`);
    await queryRunner.query(`DROP TABLE "Portfolio"`);
    await queryRunner.query(`DROP TABLE "Repository"`);
    await queryRunner.query(`DROP TABLE "ReportLog"`);
    await queryRunner.query(`DROP TYPE "public"."ReportLog_reportstatus_enum"`);
    await queryRunner.query(`DROP TABLE "PortfolioLog"`);
    await queryRunner.query(
      `DROP TYPE "public"."PortfolioLog_portfoliostatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "School"`);
    await queryRunner.query(`DROP TABLE "LoginInfo"`);
    await queryRunner.query(`DROP TABLE "OauthInfo"`);
    await queryRunner.query(
      `ALTER TABLE "recruit_tasks_task" ADD CONSTRAINT "FK_557c1995bd1c6ed75a6fb28ffcd" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruit_tasks_task" ADD CONSTRAINT "FK_eb234c3bd7952d66ffdec42e2aa" FOREIGN KEY ("recruitId") REFERENCES "recruit"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
