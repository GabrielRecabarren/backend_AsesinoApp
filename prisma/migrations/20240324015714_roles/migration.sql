/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "roles" "UserRole"[];

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId";
