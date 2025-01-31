-- DropForeignKey
ALTER TABLE `activity_approvals` DROP FOREIGN KEY `activity_approvals_activity_plan_id_fkey`;

-- AlterTable
ALTER TABLE `uks_activity_plans` MODIFY `schedule` TIMESTAMP(2) NOT NULL;

-- AddForeignKey
ALTER TABLE `activity_approvals` ADD CONSTRAINT `activity_approvals_activity_plan_id_fkey` FOREIGN KEY (`activity_plan_id`) REFERENCES `uks_activity_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
