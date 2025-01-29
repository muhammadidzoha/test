/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `KIETag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `KIETag_name_key` ON `KIETag`(`name`);
