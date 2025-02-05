/*
  Warnings:

  - A unique constraint covering the columns `[kk_number,head_phone_number]` on the table `families` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `family_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `families_kk_number_head_phone_number_key` ON `families`(`kk_number`, `head_phone_number`);

-- CreateIndex
CREATE UNIQUE INDEX `family_members_phone_number_key` ON `family_members`(`phone_number`);
