/*
  Warnings:

  - You are about to drop the column `family_member_id` on the `intervention` table. All the data in the column will be lost.
  - You are about to drop the column `institution_id` on the `intervention` table. All the data in the column will be lost.
  - You are about to drop the column `program_recommendation` on the `intervention` table. All the data in the column will be lost.
  - You are about to drop the `_ProgramToProgramActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `program_activities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[request_intervention_id]` on the table `intervention` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `puskesmas_id` to the `intervention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_intervention_id` to the `intervention` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ProgramToProgramActivity` DROP FOREIGN KEY `_ProgramToProgramActivity_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProgramToProgramActivity` DROP FOREIGN KEY `_ProgramToProgramActivity_B_fkey`;

-- DropForeignKey
ALTER TABLE `intervention` DROP FOREIGN KEY `intervention_family_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `intervention` DROP FOREIGN KEY `intervention_institution_id_fkey`;

-- DropForeignKey
ALTER TABLE `intervention` DROP FOREIGN KEY `intervention_program_recommendation_fkey`;

-- DropIndex
DROP INDEX `intervention_family_member_id_fkey` ON `intervention`;

-- DropIndex
DROP INDEX `intervention_institution_id_fkey` ON `intervention`;

-- DropIndex
DROP INDEX `intervention_program_recommendation_fkey` ON `intervention`;

-- AlterTable
ALTER TABLE `Program` ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `intervention` DROP COLUMN `family_member_id`,
    DROP COLUMN `institution_id`,
    DROP COLUMN `program_recommendation`,
    ADD COLUMN `puskesmas_id` INTEGER NOT NULL,
    ADD COLUMN `request_intervention_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_ProgramToProgramActivity`;

-- DropTable
DROP TABLE `program_activities`;

-- CreateTable
CREATE TABLE `request_interventions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `puskesmas_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `created_by` INTEGER NOT NULL,
    `family_member_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_InterventionToProgram` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_InterventionToProgram_AB_unique`(`A`, `B`),
    INDEX `_InterventionToProgram_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `intervention_request_intervention_id_key` ON `intervention`(`request_intervention_id`);

-- AddForeignKey
ALTER TABLE `request_interventions` ADD CONSTRAINT `request_interventions_family_member_id_fkey` FOREIGN KEY (`family_member_id`) REFERENCES `family_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_interventions` ADD CONSTRAINT `request_interventions_puskesmas_id_fkey` FOREIGN KEY (`puskesmas_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_interventions` ADD CONSTRAINT `request_interventions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_puskesmas_id_fkey` FOREIGN KEY (`puskesmas_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_request_intervention_id_fkey` FOREIGN KEY (`request_intervention_id`) REFERENCES `request_interventions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterventionToProgram` ADD CONSTRAINT `_InterventionToProgram_A_fkey` FOREIGN KEY (`A`) REFERENCES `intervention`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterventionToProgram` ADD CONSTRAINT `_InterventionToProgram_B_fkey` FOREIGN KEY (`B`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
