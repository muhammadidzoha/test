/*
  Warnings:

  - Added the required column `category_id` to the `health_educations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `health_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `school_environments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `health_educations` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `health_services` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `school_environments` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `uks_managements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `health_hand_book` BOOLEAN NOT NULL DEFAULT false,
    `person_in_charge` BOOLEAN NOT NULL DEFAULT false,
    `health_kie` BOOLEAN NOT NULL DEFAULT false,
    `sport_infrastructure` BOOLEAN NOT NULL DEFAULT false,
    `budget` BOOLEAN NOT NULL DEFAULT false,
    `health_care_partnership` BOOLEAN NOT NULL DEFAULT false,
    `activity_plan` BOOLEAN NOT NULL DEFAULT false,
    `score` INTEGER NOT NULL DEFAULT 0,
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `health_educations` ADD CONSTRAINT `health_educations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_services` ADD CONSTRAINT `health_services_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_environments` ADD CONSTRAINT `school_environments_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `uks_managements` ADD CONSTRAINT `uks_managements_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
