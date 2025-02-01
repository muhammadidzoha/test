/*
  Warnings:

  - A unique constraint covering the columns `[school_id]` on the table `uks_managements` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `uks_managements` ADD COLUMN `school_id` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `uks_managements_school_id_key` ON `uks_managements`(`school_id`);

-- AddForeignKey
ALTER TABLE `uks_managements` ADD CONSTRAINT `uks_managements_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
