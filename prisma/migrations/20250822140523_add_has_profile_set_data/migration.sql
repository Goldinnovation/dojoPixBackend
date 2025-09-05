/*
  Warnings:

  - You are about to drop the column `hasProfile` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "hasProfile",
ADD COLUMN     "hasProfileDataSet" BOOLEAN NOT NULL DEFAULT false;
