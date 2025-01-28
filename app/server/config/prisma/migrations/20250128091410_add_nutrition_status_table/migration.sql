-- AlterTable
ALTER TABLE `nutritions` ADD COLUMN `status_id` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `updated_by` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `nutrition_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('KURUS', 'NORMAL', 'GEMUK') NOT NULL,
    `information` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `nutritions` ADD CONSTRAINT `nutritions_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `nutrition_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
