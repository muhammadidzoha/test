/*
  Warnings:

  - You are about to drop the column `user_id` on the `responses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `responses` DROP COLUMN `user_id`,
    ADD COLUMN `institution_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_family_member_id_fkey` FOREIGN KEY (`family_member_id`) REFERENCES `family_members`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
