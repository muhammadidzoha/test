/*
  Warnings:

  - You are about to alter the column `stratification` on the `quisioners` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(7))` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `family_members` ADD COLUMN `class` VARCHAR(255) NULL,
    ADD COLUMN `phone_number` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `quisioners` MODIFY `stratification` VARCHAR(255) NULL;
