/*
  Warnings:

  - Added the required column `title` to the `activity_assigneds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity_assigneds` ADD COLUMN `job_description` TEXT NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL;
