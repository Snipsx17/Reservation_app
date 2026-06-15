-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(512);
