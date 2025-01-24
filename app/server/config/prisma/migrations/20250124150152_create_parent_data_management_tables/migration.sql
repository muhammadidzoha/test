-- CreateTable
CREATE TABLE `families` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `head_family` VARCHAR(255) NOT NULL,
    `kk_number` VARCHAR(255) NULL,
    `head_phone_number` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `family_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `height` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `education` ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3') NOT NULL,
    `job_id` INTEGER NOT NULL,
    `knowledge_nutrition_id` INTEGER NOT NULL,
    `relation` VARCHAR(255) NOT NULL,
    `residence_id` INTEGER NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `family_id` INTEGER NOT NULL,

    UNIQUE INDEX `family_members_knowledge_nutrition_id_key`(`knowledge_nutrition_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `income` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_nutritions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledge` TEXT NOT NULL,
    `score` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `residences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('OWN', 'RENT', 'OTHER') NOT NULL,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `families`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_residence_id_fkey` FOREIGN KEY (`residence_id`) REFERENCES `residences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_knowledge_nutrition_id_fkey` FOREIGN KEY (`knowledge_nutrition_id`) REFERENCES `knowledge_nutritions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
