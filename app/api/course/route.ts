import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Course ID is required' },
      { status: 400 }
    )
  }

  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            quizz: {
              include: {
                questions: true
              }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
