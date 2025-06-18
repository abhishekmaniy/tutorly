import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const { quizId, courseId } = await req.json()

    if (!quizId || !courseId) {
      return NextResponse.json(
        { error: 'quizId and courseId are required' },
        { status: 400 }
      )
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: {
            quizz: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lesson = course.lessons.find(lesson => lesson.quizz?.id === quizId)

    if (!lesson || !lesson.quizz) {
      return NextResponse.json(
        { error: 'Quiz not found in course lessons' },
        { status: 404 }
      )
    }

    const updatedQuiz = await db.quiz.update({
      where: { id: quizId },
      data: {
        isCompleted: true
      }
    })

    return NextResponse.json({ status: 200, quiz: updatedQuiz })
  } catch (error) {
    console.error('Error completing quiz:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
