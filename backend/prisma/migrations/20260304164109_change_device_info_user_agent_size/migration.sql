-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "device_info" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "user_agent" SET DATA TYPE VARCHAR(256);
