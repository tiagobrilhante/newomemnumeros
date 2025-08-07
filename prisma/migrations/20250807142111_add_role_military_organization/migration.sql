/*
  Warnings:

  - You are about to drop the column `militaryOrganizationId` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_militaryOrganizationId_fkey`;

-- DropIndex
DROP INDEX `roles_acronym_militaryOrganizationId_key` ON `roles`;

-- DropIndex
DROP INDEX `roles_deleted_idx` ON `roles`;

-- DropIndex
DROP INDEX `roles_militaryOrganizationId_idx` ON `roles`;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `militaryOrganizationId`;

-- CreateTable
CREATE TABLE `role_military_organization` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `militaryOrganizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `role_military_organization_militaryOrganizationId_idx`(`militaryOrganizationId`),
    INDEX `role_military_organization_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `roles_name_deleted_idx` ON `roles`(`name`, `deleted`);

-- AddForeignKey
ALTER TABLE `role_military_organization` ADD CONSTRAINT `role_military_organization_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_military_organization` ADD CONSTRAINT `role_military_organization_militaryOrganizationId_fkey` FOREIGN KEY (`militaryOrganizationId`) REFERENCES `military_organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
