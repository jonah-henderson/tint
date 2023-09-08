/*
  Warnings:

  - You are about to alter the column `colour` on the `Board` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(1))`.
  - You are about to alter the column `colour` on the `Tag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Board` MODIFY `colour` ENUM('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE') NOT NULL DEFAULT 'BLUE';

-- AlterTable
ALTER TABLE `Tag` MODIFY `colour` ENUM('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE') NOT NULL;
