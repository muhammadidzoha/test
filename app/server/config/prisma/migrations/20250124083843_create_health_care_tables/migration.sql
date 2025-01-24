-- CreateTable
CREATE TABLE `health_cares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `lead_name` VARCHAR(255) NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `health_cares_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `health_care_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `health_care_id` INTEGER NOT NULL,
    `position_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `health_care_members_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `modules` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `health_cares` ADD CONSTRAINT `health_cares_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_care_members` ADD CONSTRAINT `health_care_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_care_members` ADD CONSTRAINT `health_care_members_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_care_members` ADD CONSTRAINT `health_care_members_health_care_id_fkey` FOREIGN KEY (`health_care_id`) REFERENCES `health_cares`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
