import {MigrationInterface, QueryRunner} from "typeorm";

export class EditPortfolioLogEntityName1650958657105 implements MigrationInterface {
    name = 'EditPortfolioLogEntityName1650958657105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."portfolioLog_portfoliostatus_enum" AS ENUM('start', 'onprogress', 'success', 'fail')`);
        await queryRunner.query(`CREATE TABLE "portfolioLog" ("id" BIGSERIAL NOT NULL, "portfolioStatus" "public"."portfolioLog_portfoliostatus_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" bigint NOT NULL, CONSTRAINT "PK_cb4bb62e18b10a7d0d706579ee4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "portfolioLog" ADD CONSTRAINT "FK_b1af50072b35f2d91111c6dee08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portfolioLog" DROP CONSTRAINT "FK_b1af50072b35f2d91111c6dee08"`);
        await queryRunner.query(`DROP TABLE "portfolioLog"`);
        await queryRunner.query(`DROP TYPE "public"."portfolioLog_portfoliostatus_enum"`);
    }

}
