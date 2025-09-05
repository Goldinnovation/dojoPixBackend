-- CreateTable
CREATE TABLE "public"."dojo_arena" (
    "dojoId" TEXT NOT NULL,
    "dojo_User_creater" TEXT NOT NULL,
    "dojo_join_creater" TEXT NOT NULL,
    "dojo_topic" TEXT NOT NULL,
    "dojo_Background" TEXT NOT NULL,
    "dojoSessionId" TEXT NOT NULL,

    CONSTRAINT "dojo_arena_pkey" PRIMARY KEY ("dojoId")
);

-- CreateTable
CREATE TABLE "public"."dojo_session" (
    "dojoSessionId" TEXT NOT NULL,
    "dojo_player" TEXT NOT NULL,
    "dojo_player_opponent" TEXT NOT NULL,
    "dojo_image_scissors" TEXT NOT NULL,
    "dojo_image_rock" TEXT NOT NULL,
    "dojo_image_paper" TEXT NOT NULL,
    "dojo_points" INTEGER NOT NULL,

    CONSTRAINT "dojo_session_pkey" PRIMARY KEY ("dojoSessionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "dojo_arena_dojoSessionId_key" ON "public"."dojo_arena"("dojoSessionId");

-- AddForeignKey
ALTER TABLE "public"."dojo_arena" ADD CONSTRAINT "dojo_arena_dojoSessionId_fkey" FOREIGN KEY ("dojoSessionId") REFERENCES "public"."dojo_session"("dojoSessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
