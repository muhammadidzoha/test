-- CreateTable
CREATE TABLE `school_environments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `canteen` BOOLEAN NOT NULL DEFAULT false,
    `green_space` BOOLEAN NOT NULL DEFAULT false,
    `trash_can` BOOLEAN NOT NULL DEFAULT false,
    `unprotected_area_policy` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `school_environments_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `school_environments` ADD CONSTRAINT `school_environments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
