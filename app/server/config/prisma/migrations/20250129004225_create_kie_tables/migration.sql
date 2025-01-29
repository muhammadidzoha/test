-- CreateTable
CREATE TABLE `kie_contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KIETag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kie_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL,
    `banner_url` VARCHAR(255) NULL,
    `Content` LONGTEXT NOT NULL,
    `thumbnail_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Poster` (
    `id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `thumbnail_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `thumbnail_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_KIEContentToKIETag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_KIEContentToKIETag_AB_unique`(`A`, `B`),
    INDEX `_KIEContentToKIETag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kie_contents` ADD CONSTRAINT `kie_contents_type_fkey` FOREIGN KEY (`type`) REFERENCES `kie_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kie_contents` ADD CONSTRAINT `kie_contents_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_id_fkey` FOREIGN KEY (`id`) REFERENCES `kie_contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poster` ADD CONSTRAINT `Poster_id_fkey` FOREIGN KEY (`id`) REFERENCES `kie_contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_id_fkey` FOREIGN KEY (`id`) REFERENCES `kie_contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_KIEContentToKIETag` ADD CONSTRAINT `_KIEContentToKIETag_A_fkey` FOREIGN KEY (`A`) REFERENCES `kie_contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_KIEContentToKIETag` ADD CONSTRAINT `_KIEContentToKIETag_B_fkey` FOREIGN KEY (`B`) REFERENCES `KIETag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
