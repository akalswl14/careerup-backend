import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDuplicateIdOnTaskEntity1648922972390 implements MigrationInterface {
    name = 'AddDuplicateIdOnTaskEntity1648922972390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "duplicateId" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "duplicateId"`);
    }

}
