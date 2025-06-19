import { db } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export const POST = async (req: NextRequest) => {
  try {
    const { quizId, courseId, answers, timeTaken } = await req.json()

    if (!quizId || !courseId) {
      return NextResponse.json({ error: 'quizId and courseId are required' }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: { quizz: { include: { questions: true } } }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lesson = course.lessons.find(lesson => lesson.quizz?.id === quizId)
    if (!lesson || !lesson.quizz) {
      return NextResponse.json({ error: 'Quiz not found in course lessons' }, { status: 404 })
    }

    const quiz = lesson.quizz
    const questions = quiz.questions

    const ai = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })

    let gainedMarks = 0
    const updatedQuestions = []

    for (const question of questions) {
      const userAnswer = answers[question.id]
      let isCorrect = false
      let awardedMarks = 0

      switch (question.type) {
        case 'MCQ': {
          if (typeof userAnswer === 'number') {
            const selectedOption = question.options[userAnswer]
            const correctAnswer = question.correctAnswers[0]
            if (selectedOption === correctAnswer) {
              isCorrect = true
              awardedMarks = question.marks
            }
          }
          break
        }

        case 'TRUE_FALSE': {
          if (typeof userAnswer === 'boolean') {
            const correctAnswer = question.correctAnswers[0].toLowerCase() === 'true'
            if (userAnswer === correctAnswer) {
              isCorrect = true
              awardedMarks = question.marks
            }
          }
          break
        }

        case 'MULTIPLE_SELECT': {
          if (Array.isArray(userAnswer)) {
            const selectedOptions = userAnswer.map((i: number) => question.options[i])
            const sortedUser = [...selectedOptions].sort()
            const sortedCorrect = [...question.correctAnswers].sort()
            if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
              isCorrect = true
              awardedMarks = question.marks
            } else {
              const correctSelected = selectedOptions.filter(ans =>
                question.correctAnswers.includes(ans)
              )
              awardedMarks = Math.floor(
                (correctSelected.length / question.correctAnswers.length) * question.marks
              )
            }
          }
          break
        }

        case 'DESCRIPTIVE': {
          if (typeof userAnswer === 'string' && userAnswer.trim().length > 0) {
            const prompt = `
You are acting as an exam evaluator for descriptive answers. Follow these rules carefully:

1️⃣ **Question**: ${question.question}
2️⃣ **Maximum Marks**: ${question.marks}
3️⃣ **Rubric**: ${question.rubric.join(', ')}
4️⃣ **Student Answer**: ${userAnswer}

➡ Your Task:
- Evaluate the answer strictly based on the rubric and the completeness of the response.
- Output ONLY the awarded marks as a number between 0 and ${question.marks}
`
            const result = await model.generateContent(prompt)
            const rawText = result.response.text().trim()
            awardedMarks = parseInt(rawText.match(/\d+/)?.[0] || '0', 10)
            isCorrect = awardedMarks >= Math.floor(question.marks * 0.7) // mark as correct if >= 70% marks
          }
          break
        }
      }

      gainedMarks += awardedMarks

      updatedQuestions.push({
        id: question.id,
        isCorrect
      })
    }

    await db.$transaction([
      db.quiz.update({
        where: { id: quizId },
        data: {
          isCompleted: true,
          gainedMarks,
          timeTaken
        }
      }),
      ...updatedQuestions.map(q =>
        db.quizQuestion.update({
          where: { id: q.id },
          data: { isCorrect: q.isCorrect }
        })
      )
    ])

    return NextResponse.json({ status: 200, gainedMarks })
  } catch (error) {
    console.error('Error completing quiz:', error)
    return NextResponse.json({ status: 500, error: 'Failed to complete quiz' })
  }
}
