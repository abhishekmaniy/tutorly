/*
  Warnings:

  - Added the required column `gainedMarks` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTaken` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('PASS', 'FAIL');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "gainedMarks" INTEGER NOT NULL,
ADD COLUMN     "status" "QuizStatus" NOT NULL,
ADD COLUMN     "timeTaken" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;
