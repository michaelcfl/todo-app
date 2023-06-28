import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1687699589927 implements MigrationInterface {
  name = 'InitDatabase1687699589927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "done" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82814e526b8ed050af2faeb788" ON "items" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34e5d8e194110ff66f50400ff8" ON "items" ("done") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_feaf697a87522cb2963eb3a9a0" ON "items" ("updatedAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f5cbe00928ba4489cc7312573" ON "users" ("updatedAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0f5cbe00928ba4489cc7312573"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_feaf697a87522cb2963eb3a9a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34e5d8e194110ff66f50400ff8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82814e526b8ed050af2faeb788"`,
    );
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
