-- CreateTable
CREATE TABLE `Beatmaker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `follower` INTEGER NOT NULL DEFAULT 0,
    `email` VARCHAR(191) NULL,
    `insta` VARCHAR(191) NULL,

    UNIQUE INDEX `Beatmaker_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
