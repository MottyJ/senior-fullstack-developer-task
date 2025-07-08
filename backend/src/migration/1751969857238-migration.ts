import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751969857238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT OR IGNORE INTO users (username, roles, status)
            VALUES
              (
                'motty',
                json('["User","Editor","Admin"]'),
                'Enabled'
              )
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users WHERE username = 'motty'
        `);
    }

}
