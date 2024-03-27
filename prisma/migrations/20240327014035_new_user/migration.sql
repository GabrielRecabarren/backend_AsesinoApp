/*
  Warnings:

  - You are about to drop the column `roles` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "roles";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "UserRoleInGame" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "UserRoleInGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRoleInGame" ADD CONSTRAINT "UserRoleInGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleInGame" ADD CONSTRAINT "UserRoleInGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
