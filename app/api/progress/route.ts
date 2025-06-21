import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const { courseId, progress } = await req.json()

    const course = db.course.findUnique({
      where: {
        id: courseId
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId
      },
      data: {
        progress: progress
      }
    })

    return NextResponse.json({
      message: 'Progress Updated'
    })
  } catch (error) {}
}
