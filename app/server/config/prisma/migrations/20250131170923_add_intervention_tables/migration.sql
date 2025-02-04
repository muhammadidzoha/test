-- CreateTable
CREATE TABLE `intervention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recommendation` TEXT NOT NULL,
    `institution_id` INTEGER NOT NULL,
    `family_member_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `program_recommendation` INTEGER NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProgramToProgramActivity` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProgramToProgramActivity_AB_unique`(`A`, `B`),
    INDEX `_ProgramToProgramActivity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_family_member_id_fkey` FOREIGN KEY (`family_member_id`) REFERENCES `family_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intervention` ADD CONSTRAINT `intervention_program_recommendation_fkey` FOREIGN KEY (`program_recommendation`) REFERENCES `Program`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramToProgramActivity` ADD CONSTRAINT `_ProgramToProgramActivity_A_fkey` FOREIGN KEY (`A`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramToProgramActivity` ADD CONSTRAINT `_ProgramToProgramActivity_B_fkey` FOREIGN KEY (`B`) REFERENCES `program_activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
