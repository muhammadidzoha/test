-- CreateTable
CREATE TABLE `quisioners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `stratification` ENUM('MINIMAL', 'STANDAR', 'OPTIMAL', 'PARIPURNA') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quisioner_id` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `type` ENUM('MULTIPLE_CHOICE', 'BOOLEAN', 'SCALE', 'TEXT') NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `is_required` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `score` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quisioner_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `total_score` INTEGER NULL DEFAULT 0,
    `family_member_id` INTEGER NULL,
    `user_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `response_id` INTEGER NOT NULL,
    `score` INTEGER NULL DEFAULT 0,
    `boolean_value` BOOLEAN NULL,
    `text_value` VARCHAR(191) NULL,
    `option_id` INTEGER NULL,
    `scaleValue` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_quisioner_id_fkey` FOREIGN KEY (`quisioner_id`) REFERENCES `quisioners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `options` ADD CONSTRAINT `options_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_quisioner_id_fkey` FOREIGN KEY (`quisioner_id`) REFERENCES `quisioners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_response_id_fkey` FOREIGN KEY (`response_id`) REFERENCES `responses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
