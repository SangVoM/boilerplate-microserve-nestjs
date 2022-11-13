import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class user1665732245700 implements MigrationInterface {
  private tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'user_id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            collation: 'C',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            collation: 'C',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'char',
            length: '60',
          },
          {
            name: 'email_verified_at',
            type: 'timestamp',
            default: null,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_service"."users"`);
  }
}
