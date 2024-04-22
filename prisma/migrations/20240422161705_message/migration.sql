/*
  Warnings:

  - You are about to drop the column `isAccusation` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `sender` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speakingAsRole` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isAccusation",
DROP COLUMN "senderId",
ADD COLUMN     "isReceiver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "speakingAsRole" BOOLEAN NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;
