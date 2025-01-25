/*
  Warnings:

  - You are about to drop the column `height` on the `family_members` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `family_members` table. All the data in the column will be lost.
  - You are about to alter the column `relation` on the `family_members` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(2))`.

*/
-- DropForeignKey
ALTER TABLE `family_members` DROP FOREIGN KEY `family_members_knowledge_nutrition_id_fkey`;

-- AlterTable
ALTER TABLE `family_members` DROP COLUMN `height`,
    DROP COLUMN `weight`,
    MODIFY `knowledge_nutrition_id` INTEGER NULL,
    MODIFY `relation` ENUM('AYAH', 'IBU', 'LAINNYA') NOT NULL;

-- AlterTable
ALTER TABLE `residences` ADD COLUMN `address` TEXT NULL;

-- CreateTable
CREATE TABLE `nutritions` (
    `id` INTEGER NOT NULL,
    `height` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `bmi` DOUBLE NULL,
    `birth_weight` DOUBLE NULL,
    `family_member_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `updated_at` TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `behaviours` (
    `id` INTEGER NOT NULL,
    `eat_frequency` INTEGER NOT NULL,
    `drink_frequency` INTEGER NOT NULL,
    `family_member_id` INTEGER NOT NULL,
    `sleep_duration` INTEGER NOT NULL,

    UNIQUE INDEX `behaviours_family_member_id_key`(`family_member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `physical_activities` (
    `id` INTEGER NOT NULL,
    `activity` VARCHAR(255) NOT NULL,
    `behaviour_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BehaviourToPhysicalActivity` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BehaviourToPhysicalActivity_AB_unique`(`A`, `B`),
    INDEX `_BehaviourToPhysicalActivity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_knowledge_nutrition_id_fkey` FOREIGN KEY (`knowledge_nutrition_id`) REFERENCES `knowledge_nutritions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutritions` ADD CONSTRAINT `nutritions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutritions` ADD CONSTRAINT `nutritions_family_member_id_fkey` FOREIGN KEY (`family_member_id`) REFERENCES `family_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `behaviours` ADD CONSTRAINT `behaviours_family_member_id_fkey` FOREIGN KEY (`family_member_id`) REFERENCES `family_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BehaviourToPhysicalActivity` ADD CONSTRAINT `_BehaviourToPhysicalActivity_A_fkey` FOREIGN KEY (`A`) REFERENCES `behaviours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BehaviourToPhysicalActivity` ADD CONSTRAINT `_BehaviourToPhysicalActivity_B_fkey` FOREIGN KEY (`B`) REFERENCES `physical_activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
