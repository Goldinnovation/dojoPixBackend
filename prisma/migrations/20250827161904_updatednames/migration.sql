/*
  Warnings:

  - You are about to drop the column `dojoSessionId` on the `dojo_arena` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_image_paper` on the `dojo_session` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_image_rock` on the `dojo_session` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_image_scissors` on the `dojo_session` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_player` on the `dojo_session` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_player_opponent` on the `dojo_session` table. All the data in the column will be lost.
  - You are about to drop the column `dojo_points` on the `dojo_session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dojo_arena_session_Id]` on the table `dojo_arena` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dojo_arena_session_Id` to the `dojo_arena` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_Session_points` to the `dojo_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_session_image_paper` to the `dojo_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_session_image_rock` to the `dojo_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_session_image_scissors` to the `dojo_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_session_player` to the `dojo_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dojo_session_player_opponent` to the `dojo_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."dojo_arena" DROP CONSTRAINT "dojo_arena_dojoSessionId_fkey";

-- DropIndex
DROP INDEX "public"."dojo_arena_dojoSessionId_key";

-- AlterTable
ALTER TABLE "public"."dojo_arena" DROP COLUMN "dojoSessionId",
ADD COLUMN     "dojo_arena_session_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."dojo_session" DROP COLUMN "dojo_image_paper",
DROP COLUMN "dojo_image_rock",
DROP COLUMN "dojo_image_scissors",
DROP COLUMN "dojo_player",
DROP COLUMN "dojo_player_opponent",
DROP COLUMN "dojo_points",
ADD COLUMN     "dojo_Session_points" INTEGER NOT NULL,
ADD COLUMN     "dojo_session_image_paper" TEXT NOT NULL,
ADD COLUMN     "dojo_session_image_rock" TEXT NOT NULL,
ADD COLUMN     "dojo_session_image_scissors" TEXT NOT NULL,
ADD COLUMN     "dojo_session_player" TEXT NOT NULL,
ADD COLUMN     "dojo_session_player_opponent" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dojo_arena_dojo_arena_session_Id_key" ON "public"."dojo_arena"("dojo_arena_session_Id");

-- AddForeignKey
ALTER TABLE "public"."dojo_arena" ADD CONSTRAINT "dojo_arena_dojo_arena_session_Id_fkey" FOREIGN KEY ("dojo_arena_session_Id") REFERENCES "public"."dojo_session"("dojoSessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
