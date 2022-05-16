import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLoginInfo1652552492387 implements MigrationInterface {
    name = 'AddLoginInfo1652552492387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "login_info" ("id" BIGSERIAL NOT NULL, "loginSuccess" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" bigint NOT NULL, CONSTRAINT "PK_3c4bafadfa87819e057d90a4603" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "login_info" ADD CONSTRAINT "FK_3dc7622147290beb61398a7e4f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_info" DROP CONSTRAINT "FK_3dc7622147290beb61398a7e4f6"`);
        await queryRunner.query(`DROP TABLE "login_info"`);
    }

}
