import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToItem1687705138039 implements MigrationInterface {
  name = 'AddUserIdToItem1687705138039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40e681891fea5a4b3c5c2546d1" ON "items" ("userId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40e681891fea5a4b3c5c2546d1"`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "userId"`);
  }
}
