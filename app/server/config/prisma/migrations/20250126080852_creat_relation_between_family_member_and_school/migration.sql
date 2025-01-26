/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `family_members` DROP FOREIGN KEY `family_members_job_id_fkey`;

-- DropIndex
DROP INDEX `family_members_job_id_fkey` ON `family_members`;

-- AlterTable
ALTER TABLE `family_members` ADD COLUMN `institution_id` INTEGER NULL,
    MODIFY `relation` ENUM('AYAH', 'IBU', 'ANAK', 'LAINNYA') NOT NULL;

-- DropTable
DROP TABLE `Job`;

-- CreateTable
CREATE TABLE `jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `income` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
