import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const { lessonId, courseId, timeTaken } = await req.json()

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { lessons: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lesson = course.lessons.find(lesson => lesson.id === lessonId)

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const updatedLesson = await db.lesson.update({
      where: { id: lessonId },
      data: { isCompleted: true, timeTaken }
    })

    return NextResponse.json({
      message: 'Lesson marked as completed',
      lesson: updatedLesson
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
