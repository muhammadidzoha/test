/*
  Warnings:

  - A unique constraint covering the columns `[stratification]` on the table `quisioners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `quisioners_stratification_key` ON `quisioners`(`stratification`);
