/*
  Warnings:

  - Added the required column `passingMarks` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMarks` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marks` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "passingMarks" INTEGER NOT NULL,
ADD COLUMN     "totalMarks" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "marks" INTEGER NOT NULL,
ADD COLUMN     "rubric" TEXT[];
