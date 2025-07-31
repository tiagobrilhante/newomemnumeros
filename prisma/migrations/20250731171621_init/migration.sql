-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `serviceName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rankId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NULL,
    `sectionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_cpf_key`(`cpf`),
    INDEX `users_rankId_idx`(`rankId`),
    INDEX `users_roleId_idx`(`roleId`),
    INDEX `users_deleted_idx`(`deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ranks` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `acronym` VARCHAR(50) NOT NULL,
    `hierarchy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ranks_name_key`(`name`),
    UNIQUE INDEX `ranks_acronym_key`(`acronym`),
    UNIQUE INDEX `ranks_hierarchy_key`(`hierarchy`),
    INDEX `ranks_hierarchy_idx`(`hierarchy`),
    INDEX `ranks_deleted_idx`(`deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `military_organizations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `acronym` VARCHAR(50) NOT NULL,
    `color` VARCHAR(7) NOT NULL DEFAULT '#000000',
    `logo` VARCHAR(500) NOT NULL DEFAULT '/logos/default/default.png',
    `militaryOrganizationId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `military_organizations_name_key`(`name`),
    UNIQUE INDEX `military_organizations_acronym_key`(`acronym`),
    INDEX `military_organizations_militaryOrganizationId_idx`(`militaryOrganizationId`),
    INDEX `military_organizations_deleted_idx`(`deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `acronym` VARCHAR(50) NOT NULL,
    `militaryOrganizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `sections_militaryOrganizationId_idx`(`militaryOrganizationId`),
    INDEX `sections_deleted_idx`(`deleted`),
    UNIQUE INDEX `sections_acronym_militaryOrganizationId_key`(`acronym`, `militaryOrganizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `acronym` VARCHAR(50) NOT NULL,
    `militaryOrganizationId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `roles_militaryOrganizationId_idx`(`militaryOrganizationId`),
    INDEX `roles_deleted_idx`(`deleted`),
    UNIQUE INDEX `roles_acronym_militaryOrganizationId_key`(`acronym`, `militaryOrganizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `category` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `permissions_slug_key`(`slug`),
    INDEX `permissions_deleted_idx`(`deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `role_permissions_permissionId_idx`(`permissionId`),
    INDEX `role_permissions_roleId_idx`(`roleId`),
    UNIQUE INDEX `role_permissions_permissionId_roleId_key`(`permissionId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_section` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `role_section_sectionId_idx`(`sectionId`),
    INDEX `role_section_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_rankId_fkey` FOREIGN KEY (`rankId`) REFERENCES `ranks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `military_organizations` ADD CONSTRAINT `military_organizations_militaryOrganizationId_fkey` FOREIGN KEY (`militaryOrganizationId`) REFERENCES `military_organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_militaryOrganizationId_fkey` FOREIGN KEY (`militaryOrganizationId`) REFERENCES `military_organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_militaryOrganizationId_fkey` FOREIGN KEY (`militaryOrganizationId`) REFERENCES `military_organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_section` ADD CONSTRAINT `role_section_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_section` ADD CONSTRAINT `role_section_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
