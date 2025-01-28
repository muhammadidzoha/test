/*
  Warnings:

  - You are about to drop the column `sleep_duration` on the `behaviours` table. All the data in the column will be lost.
  - You are about to drop the `_BehaviourToPhysicalActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `physical_activities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `physical_activity` to the `behaviours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sleep_quality` to the `behaviours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_BehaviourToPhysicalActivity` DROP FOREIGN KEY `_BehaviourToPhysicalActivity_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BehaviourToPhysicalActivity` DROP FOREIGN KEY `_BehaviourToPhysicalActivity_B_fkey`;

-- AlterTable
ALTER TABLE `behaviours` DROP COLUMN `sleep_duration`,
    ADD COLUMN `physical_activity` INTEGER NOT NULL,
    ADD COLUMN `sleep_quality` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `nutritions` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- DropTable
DROP TABLE `_BehaviourToPhysicalActivity`;

-- DropTable
DROP TABLE `physical_activities`;
