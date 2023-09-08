/*
  Warnings:

  - Added the required column `index` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Card` ADD COLUMN `index` INTEGER NOT NULL,
    ADD COLUMN `listId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `List` ADD COLUMN `index` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_CardToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CardToTag_AB_unique`(`A`, `B`),
    INDEX `_CardToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CardToTag` ADD CONSTRAINT `_CardToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CardToTag` ADD CONSTRAINT `_CardToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
