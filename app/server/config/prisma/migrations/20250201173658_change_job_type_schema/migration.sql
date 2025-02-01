/*
  Warnings:

  - You are about to drop the column `name` on the `Job` table. All the data in the column will be lost.
  - Added the required column `job_type_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Job` DROP COLUMN `name`,
    ADD COLUMN `job_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `job_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `type` ENUM('TIDAK_BEKERJA_BURUH_SEJENISNYA', 'PEKERJA_HONORER_KONTRAK', 'PEGAWAI_NEGERI_KARYAWAN_SWASTA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_job_type_id_fkey` FOREIGN KEY (`job_type_id`) REFERENCES `job_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
