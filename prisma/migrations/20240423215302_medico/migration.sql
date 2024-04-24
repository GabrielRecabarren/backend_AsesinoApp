/*
  Warnings:

  - The values [DOCTOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('DEFAULT', 'MEDICO', 'ASESINO', 'FISCAL', 'DETECTIVE', 'MANIACO', 'PERIODISTA', 'COMPLICE');
ALTER TABLE "UserRoleInGame" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;
