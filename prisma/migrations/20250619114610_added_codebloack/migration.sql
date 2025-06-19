/*
  Warnings:

  - You are about to drop the column `content` on the `Lesson` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('CODE', 'MATH', 'GRAPH', 'TEXT');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "ContentType" NOT NULL,
    "code" TEXT,
    "math" TEXT,
    "graph" JSONB,
    "text" TEXT,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
