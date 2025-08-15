-- AlterTable
ALTER TABLE `users` ADD COLUMN `militaryOrganizationId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `users_militaryOrganizationId_idx` ON `users`(`militaryOrganizationId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_militaryOrganizationId_fkey` FOREIGN KEY (`militaryOrganizationId`) REFERENCES `military_organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users_sectionId_fkey` TO `users_sectionId_idx`;
