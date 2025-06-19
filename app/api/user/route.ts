import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const { id, email, fullName } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing id or email' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({ where: { id } })

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 })
    }

    const user = await db.user.create({
      data: {
        id,
        name: fullName,
        email,
        courses: {
          create: []
        }
      }
    })
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET (req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId ' }, { status: 400 })
    }

    const user = await db.user.findFirst({
      where: {
        id: userId
      },
      include: {
        courses: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizz: {
                  include: {
                    questions: true
                  }
                },
                contentBlocks: true
              }
            },
            keyPoints: true,
            summary: true,
            analytics: true
          }
        }
      }
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
