-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "accusations" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isAccusation" BOOLEAN NOT NULL DEFAULT false;
