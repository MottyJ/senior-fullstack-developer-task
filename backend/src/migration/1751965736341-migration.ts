import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1751965736341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'roles',
                type: 'json',
                isNullable: true,
            }));

            await queryRunner.addColumn('users', new TableColumn({
                name: 'status_temp',
                type: 'enum',
                enum: ['Enabled', 'Disabled', 'Deleted'],
                isNullable: true,
            }));


            await queryRunner.query(`
                UPDATE users
                SET
                  roles       = json_array(role),
                  status_temp = CASE WHEN status = 1 THEN 'Enabled' ELSE 'Disabled' END
              `);

            await queryRunner.dropColumn('users', 'role');
            await queryRunner.dropColumn('users', 'status');

            await queryRunner.renameColumn('users', 'status_temp', 'status');

            await queryRunner.changeColumn('users', 'roles', new TableColumn({
                name: 'roles',
                type: 'json',
                isNullable: false,
                default: "'[\"User\"]'",
            }));
            await queryRunner.changeColumn('users', 'status', new TableColumn({
                name: 'status',
                type: 'enum',
                enum: ['Enabled', 'Disabled', 'Deleted'],
                isNullable: false,
                default: `'Enabled'`,
            }));
        } catch (error) {
            console.error('Migration up error:', error);
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'status_temp',
                type: 'integer',
                isNullable: true,
            }));

            await queryRunner.addColumn('users', new TableColumn({
                name: 'role',
                type: 'text',
                isNullable: false,
                default: "'User'",
            }));

            await queryRunner.query(`
                UPDATE users
                SET
                  status_temp = CASE WHEN status = 'Enabled' THEN 1 ELSE 0 END,
                  role = json_extract(roles, '$[0]')
            `);

            await queryRunner.dropColumn('users', 'roles');
            await queryRunner.dropColumn('users', 'status');

            await queryRunner.renameColumn('users', 'status_temp', 'status');
        } catch (error) {
            console.error('Migration down error:', error);
            throw error;
        }
    }

}
