import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { db } from '@/lib/db' // your Prisma client instance

export async function GET (req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        lessons: {
          include: { quizz: true }
        }
      }
    })

    if (!course)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const allLessonsCompleted = course.lessons.every(
      lesson => lesson.isCompleted
    )
    const allQuizzesCompleted = course.lessons.every(
      lesson => lesson.quizz?.isCompleted
    )

    if (allLessonsCompleted && allQuizzesCompleted && !course.completedAt) {
      await db.course.update({
        where: { id: courseId },
        data: { completedAt: new Date() }
      })
      return NextResponse.json({ completed: true })
    }

    return NextResponse.json({ completed: false })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
