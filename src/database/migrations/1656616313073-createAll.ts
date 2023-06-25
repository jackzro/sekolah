import {MigrationInterface, QueryRunner} from "typeorm";

export class createAll1656616313073 implements MigrationInterface {
    name = 'createAll1656616313073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` varchar(255) NOT NULL, \`grade\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`gender\` varchar(255) NULL, \`agama\` varchar(255) NULL, \`birthDate\` varchar(255) NULL, \`motherName\` varchar(255) NULL, \`motherNumber\` varchar(255) NULL, \`fatherName\` varchar(255) NULL, \`fatherNumber\` varchar(255) NULL, \`joinDate\` varchar(255) NULL, \`status\` tinyint NULL, \`bloodType\` varchar(255) NULL, \`uangSekolah\` int NOT NULL, \`uangKegiatan\` int NULL, \`vBcaSekolah\` varchar(255) NOT NULL, \`vBcaKegiatan\` varchar(255) NOT NULL, \`keterangan\` varchar(255) NULL, \`anakBaru\` tinyint NULL, \`totalTunggakan\` int NULL, \`kewarganegaraan\` varchar(255) NULL, \`anakKe\` varchar(255) NULL, \`language\` varchar(255) NULL, \`tinggalPada\` varchar(255) NULL, \`jarakKeSekolah\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`period\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`iuran\` varchar(255) NOT NULL, \`jumlahTagihan\` int NOT NULL, \`jumlahDenda\` int NOT NULL, \`jumlahAdmin\` int NOT NULL, \`bulanIuran\` varchar(255) NOT NULL, \`tglTagihan\` datetime NOT NULL, \`tglDenda\` datetime NOT NULL, \`cicilanKe\` int NOT NULL, \`caraBayar\` varchar(255) NOT NULL, \`vBcaKode\` varchar(255) NOT NULL, \`tanggalBayar\` datetime NULL, \`jumlahBayar\` varchar(255) NOT NULL, \`userBayar\` varchar(255) NOT NULL, \`buktiBayar\` varchar(255) NOT NULL, \`statusBayar\` tinyint NOT NULL, \`keterangan\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`studentId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_b2731e10aef7f886a08c552290e\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_b2731e10aef7f886a08c552290e\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`students\``);
    }

}
