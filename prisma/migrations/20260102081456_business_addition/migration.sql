/*
  Warnings:

  - You are about to drop the column `user_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `userRole` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - Added the required column `businessId` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stores` DROP FOREIGN KEY `stores_user_id_fkey`;

-- DropIndex
DROP INDEX `stores_user_id_fkey` ON `stores`;

-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stores` DROP COLUMN `user_id`,
    ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`,
    ADD COLUMN `businessId` INTEGER NULL,
    MODIFY `userRole` ENUM('ADMIN', 'OWNER', 'STAFF') NOT NULL DEFAULT 'STAFF';

-- CreateTable
CREATE TABLE `businesses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `businesses_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StoreStaff` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StoreStaff_AB_unique`(`A`, `B`),
    INDEX `_StoreStaff_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `customers_businessId_idx` ON `customers`(`businessId`);

-- CreateIndex
CREATE INDEX `stores_businessId_idx` ON `stores`(`businessId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `businesses` ADD CONSTRAINT `businesses_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StoreStaff` ADD CONSTRAINT `_StoreStaff_A_fkey` FOREIGN KEY (`A`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StoreStaff` ADD CONSTRAINT `_StoreStaff_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `customers` RENAME INDEX `customers_storeId_fkey` TO `customers_storeId_idx`;
