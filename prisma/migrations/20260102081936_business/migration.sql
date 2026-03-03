/*
  Warnings:

  - You are about to drop the column `name` on the `businesses` table. All the data in the column will be lost.
  - Added the required column `business_name` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `businesses` DROP COLUMN `name`,
    ADD COLUMN `business_name` VARCHAR(191) NOT NULL;
