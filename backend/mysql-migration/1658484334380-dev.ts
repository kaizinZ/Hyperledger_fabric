import {MigrationInterface, QueryRunner} from "typeorm";

export class dev1658484334380 implements MigrationInterface {
    name = 'dev1658484334380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`organization\` (\`organizationId\` varchar(36) NOT NULL, \`domain\` varchar(255) NOT NULL, \`organizationNumber\` int NOT NULL, PRIMARY KEY (\`organizationId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`organization\``);
    }

}
