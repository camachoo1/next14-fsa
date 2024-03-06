/*
  Warnings:

  - The primary key for the `OAuthAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OAuthAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OAuthAccount" DROP CONSTRAINT "OAuthAccount_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("providerId", "providerUserId");
