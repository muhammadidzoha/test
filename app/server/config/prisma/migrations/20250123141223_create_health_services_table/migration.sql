-- CreateTable
CREATE TABLE `health_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `heatlh_check_routine` BOOLEAN NOT NULL DEFAULT false,
    `referral_handling` BOOLEAN NOT NULL DEFAULT false,
    `consuling_facility` BOOLEAN NOT NULL DEFAULT false,
    `periodic_screening_inspection` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `health_services_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `health_services` ADD CONSTRAINT `health_services_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
