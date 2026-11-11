-- Initialize an empty MariaDB database selected by the client.
-- Example: mariadb -u root -p user-admin < prisma/schema.sql
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `roleId` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `user` ADD CONSTRAINT `user_roleId_fkey`
    FOREIGN KEY (`roleId`) REFERENCES `role`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO `role` (`id`, `title`) VALUES
    (1, 'user'),
    (2, 'generic'),
    (3, 'admin');
