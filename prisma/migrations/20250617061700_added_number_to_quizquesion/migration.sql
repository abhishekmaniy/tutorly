/*
  Warnings:

  - Added the required column `number` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'TRUE_FALSE';

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "number" INTEGER NOT NULL;
