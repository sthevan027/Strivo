-- AlterTable: add refresh_token, username, bio and phone to user
ALTER TABLE "user" ADD COLUMN "refresh_token" TEXT;
ALTER TABLE "user" ADD COLUMN "username"      VARCHAR(50);
ALTER TABLE "user" ADD COLUMN "bio"           VARCHAR(500);
ALTER TABLE "user" ADD COLUMN "phone"         VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
