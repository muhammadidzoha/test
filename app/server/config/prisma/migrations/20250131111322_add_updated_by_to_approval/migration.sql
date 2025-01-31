-- AlterTable
ALTER TABLE `activity_approvals` ADD COLUMN `approved_by` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `activity_approvals` ADD CONSTRAINT `activity_approvals_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
