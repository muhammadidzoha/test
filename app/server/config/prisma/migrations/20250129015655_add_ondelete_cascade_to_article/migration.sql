-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_id_fkey`;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_id_fkey` FOREIGN KEY (`id`) REFERENCES `kie_contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
