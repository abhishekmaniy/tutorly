/*
  Warnings:

  - Added the required column `duration` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "duration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "whatYouLearned" TEXT[],
    "skillsGained" TEXT[],
    "nextSteps" TEXT[],

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyPoint" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "points" TEXT[],

    CONSTRAINT "KeyPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "timeSpentTotal" DOUBLE PRECISION NOT NULL,
    "timeSpentLessons" DOUBLE PRECISION NOT NULL,
    "timeSpentQuizzes" DOUBLE PRECISION NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "totalQuizzes" INTEGER NOT NULL,
    "passedQuizzes" INTEGER NOT NULL,
    "grade" "Grade" NOT NULL,
    "lessonsCompleted" INTEGER NOT NULL,
    "quizzesCompleted" INTEGER NOT NULL,
    "totalLessons" INTEGER NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_courseId_key" ON "Summary"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_courseId_key" ON "Analytics"("courseId");

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyPoint" ADD CONSTRAINT "KeyPoint_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
