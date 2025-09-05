/*
  Warnings:

  - You are about to drop the column `userPassword1` on the `account` table. All the data in the column will be lost.
  - Added the required column `userPassword` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "userPassword1",
ADD COLUMN     "userPassword" TEXT NOT NULL;
