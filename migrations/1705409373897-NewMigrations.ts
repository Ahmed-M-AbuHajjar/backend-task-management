/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1705409373897 implements MigrationInterface {
    name = 'NewMigrations1705409373897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePicture" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."task_category_enum" AS ENUM('work', 'personal', 'shopping')`);
        await queryRunner.query(`ALTER TABLE "task" ADD "category" "public"."task_category_enum" NOT NULL DEFAULT 'personal'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."task_category_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePicture"`);
    }

}
