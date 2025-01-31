-- CreateTable
CREATE TABLE `uks_activity_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `schedule` DATETIME(3) NOT NULL,
    `budget` DOUBLE NULL,
    `status` ENUM('DRAFT', 'SCHEDULED', 'APPROVED', 'ONGOING', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `health_care_id` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `atached_document` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_approvals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity_plan_id` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `comment` TEXT NULL,

    UNIQUE INDEX `activity_approvals_activity_plan_id_key`(`activity_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_assigneds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity_plan_id` INTEGER NOT NULL,
    `assigned_to` INTEGER NOT NULL,
    `progress` ENUM('NOT_STARTED', 'PREPARATION', 'EXECUTION', 'FINALIZING', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `uks_activity_plans` ADD CONSTRAINT `uks_activity_plans_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `uks_activity_plans` ADD CONSTRAINT `uks_activity_plans_health_care_id_fkey` FOREIGN KEY (`health_care_id`) REFERENCES `health_cares`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_approvals` ADD CONSTRAINT `activity_approvals_activity_plan_id_fkey` FOREIGN KEY (`activity_plan_id`) REFERENCES `uks_activity_plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_assigneds` ADD CONSTRAINT `activity_assigneds_activity_plan_id_fkey` FOREIGN KEY (`activity_plan_id`) REFERENCES `uks_activity_plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_assigneds` ADD CONSTRAINT `activity_assigneds_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `health_care_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
