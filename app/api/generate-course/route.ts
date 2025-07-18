import { db } from '@/lib/db'
import { ContentType } from '@/lib/generated/prisma'
import { getAuth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

async function generateValidJson (
  prompt: string,
  model: any,
  retries = 3
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      let text = result.response
        .text()
        .replace(/```json|```/g, '')
        .replace(/\r/g, '')
        .replace(/\u0000/g, '')
        .trim()

      text = text.replace(/[\x00-\x1F\x7F]/g, (c: string) =>
        c === '\n' || c === '\t' ? c : ''
      )

      return JSON.parse(text)
    } catch (err) {
      console.warn(`JSON parse error on attempt ${i + 1}:`, err)
      if (i === retries - 1)
        throw new Error(
          `Failed to generate valid JSON after ${retries} attempts.`
        )
    }
  }
}

export async function POST (req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt } = await req.json()
  const ai = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

  try {
    // 1️⃣ Generate Syllabus
    const syllabusJson = await generateValidJson(
      `
You are an expert educational content creator.

Generate a **comprehensive syllabus** for the topic: **"${prompt}"**.

## 📚 Requirements:
- **Determine the appropriate number of lessons** required to thoroughly teach the topic **based on its depth, complexity, and the coverage required**.
- The syllabus should be **as long or as short as necessary** to fully cover the topic.
- For **broad or complex topics**, generate more lessons (e.g., 8, 10, or more).
- For **narrow or introductory topics**, fewer lessons may be sufficient.
- **DO NOT restrict the syllabus to a specific number of lessons like 4-6** → **generate as many as are logically required**.
- Each lesson should focus on a **distinct subtopic or major concept** contributing to a clear learning progression.
- **Ensure that the sequence of lessons builds understanding logically from start to finish.**

## 📦 JSON Format (Strict):
Return **ONLY** a **valid JSON object** matching **this exact structure**:
{
  "title": "Course Title",
  "description": "Concise description of the course in 1-2 sentences.",
  "lessons": [
    {
      "title": "Lesson Title",
      "duration": "e.g., '10 minutes'"
    }
  ]
}

## ✅ Rules:
- **Lesson Titles** → Must be **clear, specific, and focused**.
- **Lesson Durations** → Should reflect the expected depth and complexity of each lesson.
  - Deep, complex lessons → Longer durations (e.g., '20 minutes', '30 minutes')
  - Introductory or overview lessons → Shorter durations (e.g., '10 minutes', '15 minutes')
- Avoid generic lesson names like "Introduction" unless truly necessary.
- Ensure **logical sequence** of lessons, covering foundational concepts before advanced topics.
- **No markdown. No links. No explanations outside JSON. Return ONLY the JSON object.**

`,
      model
    )

    console.log('Syllabus Generated', syllabusJson)

    const lessons = []
    for (const lessonObj of syllabusJson.lessons) {
      const lessonTitle = lessonObj.title
      const lessonDuration = lessonObj.duration

      // 2️⃣ Generate Lesson Content

      const context = await generateValidJson(
        `
You are an expert curriculum designer.

Generate a **detailed outline** and context for a lesson titled **"${lessonTitle}"**. This should include:

1️⃣ **Objective** → What will the learner achieve after completing the lesson?

2️⃣ **Detailed Breakdown** → List 5 to 7 **key subtopics or sections** necessary to fully cover the lesson. Each should be phrased as a **short section heading** with **1-2 sentences description**.

Return a JSON object:

{
  "title": "${lessonTitle}",
  "objective": "Learning outcome in 1 sentence.",
  "sections": [
    {
      "title": "Section Heading",
      "description": "1-2 sentence description of what this part will teach."
    }
  ]
}

No explanation. Return ONLY JSON.
`,
        model
      )

      const allContentBlocks = []

      for (const [index, section] of context.sections.entries()) {
        const sectionDetail = await generateValidJson(
          `
You are an expert lesson content creator.

Generate **detailed, structured lesson content blocks** for the section titled: "${section.title}"
Context of the lesson: "${context.objective}"
Section Description: "${section.description}"

## 📦 Output Format
Return ONLY a valid JSON object with this **EXACT** structure:

{
  "title": "${section.title}",
  "contentBlocks": [
    {
      "type": "TEXT" | "CODE" | "MATH" | "GRAPH",
      "content": "Detailed content here based on the type."
    }
  ]
}

## 🏷️ Content Block Rules:
- **type** → One of exactly: **"TEXT"**, **"CODE"**, **"MATH"**, or **"GRAPH"** (case-sensitive).
- **content** →
  - **TEXT** → Explanations, examples, and descriptions
  - **CODE** → Generate ONLY if the topic **requires code to explain**. Otherwise, **DO NOT** generate CODE blocks unnecessarily.
  - **MATH** → Mathematical equations or expressions when necessary
  - **GRAPH** → JSON structure representing chart/graph data when appropriate

## ✅ Generation Rules:
- Generate **CODE blocks ONLY if the topic specifically involves or benefits from code**. If not needed → **skip CODE blocks**.
- Do **NOT** generate "CODE" blocks just to fill content. Include **TEXT**, **MATH**, or **GRAPH** as required.
- Ensure **logical flow** matching the section description.
- Use **TEXT** as the default if unsure.
- Combine different block types logically where appropriate.
- **NO extra fields or unknown "type" values. ONLY use "TEXT", "CODE", "MATH", or "GRAPH".**
- **Return ONLY the JSON object**, without any markdown wrappers or additional explanation.

NO explanations or text outside the JSON.
`,
          model
        )

        console.log('ContetBlock Generated', sectionDetail.ContetBlock)

        allContentBlocks.push(...sectionDetail.contentBlocks)
      }

      const lessonJson = {
        title: context.title,
        description: context.objective,
        contentBlocks: allContentBlocks.map((block, index) => ({
          ...block,
          order: index + 1 // Ensure order is continuous globally
        }))
      }

      // 3️⃣ Generate Quiz
      const quizJson = await generateValidJson(
        `
You are an expert quiz generator.

Generate a **high-quality, comprehensive quiz** that tests the learner's understanding of the following lesson content **in depth**.

## 📘 Lesson Content (Reference for Quiz Generation):
${JSON.stringify(lessonJson.contentBlocks)}

## 📦 Output Format (Strict JSON):
Return ONLY a **valid JSON object** matching this exact structure:
{
  "title": "Quiz for ${lessonTitle}",
  "duration": "e.g., '10 minutes'",
  "totalMarks": 50,
  "passingMarks": 30,
  "status": "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED",
  "questions": [
    {
      "number": 1, // Sequential starting from 1
      "question": "Detailed, clear question based on the lesson content above.",
      "type": "MCQ" | "MULTIPLE_SELECT" | "DESCRIPTIVE" | "TRUE_FALSE",
      "options": ["Option1", "Option2"], // Optional for DESCRIPTIVE
      "marks": 10,
      "correctAnswers": ["Correct Answer(s)"], // Required for all except DESCRIPTIVE
      "explanation": "Concise explanation of why this is the correct answer.",
      "rubric": ["Point 1...", "Point 2..."] // Required for DESCRIPTIVE
    }
  ]
}

## ✅ Quiz Generation Requirements:

- **Base questions directly on the provided lesson contentBlocks, especially CODE and MATH.**
- Include **code-based questions asking learners to predict outputs, debug, or explain code.**
- **MATH-based content → generate problems requiring solving or explanation.**
- **At least 5 diverse questions**:
  - Mix of **MCQ**, **MULTIPLE_SELECT**, **TRUE_FALSE**, and at least **1 DESCRIPTIVE** with rubric.
- Ensure **totalMarks = sum of all question marks**.
- Set **passingMarks ≈ 60% of totalMarks**.
- Use **number** for sequential question numbering starting from 1.
- **Do NOT repeat content unnecessarily.**
- **No markdown. No links. No explanations outside JSON. Return ONLY the JSON object.**

`,
        model
      )
      console.log('Quiz Generated', quizJson)

      lessons.push({
        title: lessonJson.title,
        description: lessonJson.description,
        contentBlocks: lessonJson.contentBlocks,
        duration: lessonDuration,
        quizDuration: quizJson.duration,
        totalMarks: quizJson.totalMarks,
        passingMarks: quizJson.passingMarks,
        quizzes: quizJson.questions
      })
    }

    // 4️⃣ Generate Summary
    const summaryJson = await generateValidJson(
      `
Generate a concise course summary in valid JSON format:
{
  "overview": "Overview...",
  "whatYouLearned": ["Item1", "Item2"],
  "skillsGained": ["Skill1", "Skill2"],
  "nextSteps": ["Next1", "Next2"]
}
4-6 items in each list. Course Title: "${prompt}"
`,
      model
    )

    console.log('Summary Generated', summaryJson)

    // 5️⃣ Generate KeyPoints
    const keyPointJson = await generateValidJson(
      `
Generate key points in valid JSON:
[
  { "category": "Category Name", "points": ["Point1", "Point2"] }
]
3-4 categories, 4-6 points each. Course Title: "${prompt}"
`,
      model
    )

    console.log('keypoint Generated', keyPointJson)

    // 6️⃣ Generate Analytics
    const analyticsJson = await generateValidJson(
      `
Generate course analytics in valid JSON:
{
  "timeSpentTotal": float,
  "timeSpentLessons": float,
  "timeSpentQuizzes": float,
  "averageScore": float,
  "totalQuizzes": integer,
  "passedQuizzes": integer,
  "grade": "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT",
  "lessonsCompleted": integer,
  "quizzesCompleted": integer,
  "totalLessons": integer
}
Course Title: "${prompt}"
`,
      model
    )
    console.log('Anaylytics Generated', analyticsJson)

    // 7️⃣ Save to Database
    const course = await db.course.create({
      data: {
        title: syllabusJson.title,
        description: syllabusJson.description,
        user: { connect: { id: userId } },
        lessons: {
          create: lessons.map((lessonData, idx) => ({
            title: lessonData.title,
            description: lessonData.description,
            duration: lessonData.duration,
            order: idx,
            contentBlocks: {
              create: lessonData.contentBlocks.map(
                (block: any, blockIdx: number) => {
                  const typeUpper = block.type.toUpperCase() as ContentType
                  if (!Object.values(ContentType).includes(typeUpper)) {
                    throw new Error(`Invalid content block type: ${block.type}`)
                  }

                  return {
                    order: block.order || blockIdx + 1,
                    type: typeUpper, // ✅ fixed here
                    code:
                      typeUpper === 'CODE' ? String(block.content) : undefined,
                    math:
                      typeUpper === 'MATH' ? String(block.content) : undefined,
                    graph: typeUpper === 'GRAPH' ? block.content : undefined,
                    text:
                      typeUpper === 'TEXT' ? String(block.content) : undefined
                  }
                }
              )
            },
            quizz: {
              create: {
                title: `${lessonData.title} Quiz`,
                duration: lessonData.quizDuration,
                totalMarks: lessonData.totalMarks,
                passingMarks: lessonData.passingMarks,
                isCompleted: false,
                gainedMarks: 0,
                timeTaken: 0,
                questions: {
                  create: lessonData.quizzes.map((q: any) => ({
                    question: q.question,
                    type: q.type,
                    number: q.number,
                    options: q.options || [],
                    marks: q.marks || 5,
                    correctAnswers: q.correctAnswers || [],
                    explanation: q.explanation || '',
                    rubric: q.rubric || []
                  }))
                }
              }
            }
          }))
        },
        summary: {
          create: {
            overview: summaryJson.overview,
            whatYouLearned: summaryJson.whatYouLearned,
            skillsGained: summaryJson.skillsGained,
            nextSteps: summaryJson.nextSteps
          }
        },
        keyPoints: {
          create: keyPointJson.map((kp: any) => ({
            category: kp.category,
            points: kp.points
          }))
        },
        analytics: {
          create: {
            timeSpentTotal: analyticsJson.timeSpentTotal,
            timeSpentLessons: analyticsJson.timeSpentLessons,
            timeSpentQuizzes: analyticsJson.timeSpentQuizzes,
            averageScore: analyticsJson.averageScore,
            totalQuizzes: analyticsJson.totalQuizzes,
            passedQuizzes: analyticsJson.passedQuizzes,
            grade: analyticsJson.grade,
            lessonsCompleted: analyticsJson.lessonsCompleted,
            quizzesCompleted: analyticsJson.quizzesCompleted,
            totalLessons: analyticsJson.totalLessons
          }
        }
      },
      include: {
        lessons: {
          include: {
            contentBlocks: true,
            quizz: { include: { questions: true } }
          }
        },
        summary: true,
        keyPoints: true,
        analytics: true
      }
    })

    return NextResponse.json({ id: course.id, course })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to generate course' },
      { status: 500 }
    )
  }
}
