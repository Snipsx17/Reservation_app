/*
  Warnings:

  - You are about to drop the column `token_verificacion` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "token_verificacion",
ADD COLUMN     "token_verification" UUID;
