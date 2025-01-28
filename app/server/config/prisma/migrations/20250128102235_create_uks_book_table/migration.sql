-- CreateTable
CREATE TABLE `uks_books` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(2) NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NULL DEFAULT CURRENT_TIMESTAMP(2),
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `thumbnail_url` VARCHAR(255) NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `health_care_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `uks_books` ADD CONSTRAINT `uks_books_health_care_id_fkey` FOREIGN KEY (`health_care_id`) REFERENCES `health_cares`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
