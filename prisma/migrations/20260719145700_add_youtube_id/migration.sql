-- AlterTable
ALTER TABLE `Beatmaker` ADD COLUMN `youtubeId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Beatmaker_youtubeId_key` ON `Beatmaker`(`youtubeId`);
