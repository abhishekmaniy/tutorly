// app/api/generate-course/route.ts

import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const encoder = new TextEncoder()

function streamData (controller: ReadableStreamDefaultController, data: string) {
  controller.enqueue(encoder.encode(`data: ${data}\n\n`))
}

async function generateValidJsonWithRetries (
  prompt: string,
  model: any,
  maxRetries = 5
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      console.warn(`Attempt ${attempt} failed to generate valid JSON:`, err)
      if (attempt === maxRetries)
        throw new Error(`Failed after ${maxRetries} attempts.`)
      // ⏱️ Add delay between retries to avoid rate-limiting:
      await new Promise(res => setTimeout(res, 1000 * attempt))
    }
  }
}

export async function POST (req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { prompt } = await req.json()
  const ai = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const stream = new ReadableStream({
    async start (controller) {
      try {
        streamData(controller, '⏳ Starting generation...')

        // 1️⃣ Generate Syllabus
        streamData(controller, '📚 Generating syllabus...')
        const syllabusJson = await generateValidJsonWithRetries(
          getSyllabusPrompt(prompt),
          model
        )
        streamData(
          controller,
          `✅ Syllabus generated with ${syllabusJson.lessons.length} lessons.`
        )

        const lessons = []

        for (const lessonObj of syllabusJson.lessons) {
          const lessonTitle = lessonObj.title
          const lessonDuration = lessonObj.duration
          streamData(controller, `📖 ${lessonTitle}`)

          const context = await generateValidJsonWithRetries(
            getLessonContextPrompt(lessonTitle),
            model
          )

          const allContentBlocks = []
          for (const section of context.sections) {
            streamData(controller, `📝 Section: ${section.title}`)
            const sectionDetail = await generateValidJsonWithRetries(
              getSectionContentPrompt(section, context),
              model
            )
            for (const block of sectionDetail.contentBlocks) {
              streamData(controller, `📦 ${block.type}: ${block.content}`)
            }
            allContentBlocks.push(...sectionDetail.contentBlocks)
          }

          const quizJson = await generateValidJsonWithRetries(
            getQuizPrompt(lessonTitle, allContentBlocks),
            model
          )
          lessons.push({
            lessonTitle,
            lessonDuration,
            context,
            allContentBlocks,
            quizJson
          })
        }

        streamData(controller, '🗂️ Generating summary...')
        const summaryJson = await generateValidJsonWithRetries(
          getSummaryPrompt(prompt),
          model
        )

        streamData(controller, '🔑 Generating key points...')
        const keyPointJson = await generateValidJsonWithRetries(
          getKeyPointsPrompt(prompt),
          model
        )

        streamData(controller, '📊 Generating analytics...')
        const analyticsJson = await generateValidJsonWithRetries(
          getAnalyticsPrompt(prompt),
          model
        )

        streamData(controller, '💾 Saving to database...')

        await db.course.create({
          data: {
            title: syllabusJson.title,
            description: syllabusJson.description,
            user: { connect: { id: userId } },
            lessons: {
              create: lessons.map((l, idx) => ({
                title: l.context.title,
                description: l.context.objective,
                duration: l.lessonDuration,
                order: idx,
                contentBlocks: {
                  create: l.allContentBlocks.map((block, blockIdx) => ({
                    order: blockIdx + 1,
                    type: block.type,
                    text: block.type === 'TEXT' ? block.content : undefined,
                    code: block.type === 'CODE' ? block.content : undefined,
                    math: block.type === 'MATH' ? block.content : undefined,
                    graph: block.type === 'GRAPH' ? block.content : undefined
                  }))
                },
                quizz: {
                  create: {
                    title: l.context.title + ' Quiz',
                    duration: l.quizJson.duration,
                    totalMarks: l.quizJson.totalMarks,
                    passingMarks: l.quizJson.passingMarks,
                    isCompleted: false,
                    gainedMarks: 0,
                    timeTaken: 0,
                    questions: { create: l.quizJson.questions }
                  }
                }
              }))
            },
            summary: { create: summaryJson },
            keyPoints: { create: keyPointJson },
            analytics: { create: analyticsJson }
          }
        })

        streamData(controller, '✅ Course generation complete.')
        controller.close()
      } catch (error) {
        console.error(error)
        streamData(controller, '❌ Error generating course')
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Transfer-Encoding': 'chunked'
    }
  })
}

function getSyllabusPrompt (topic: string) {
  return `
You are an expert educational content creator.

Generate a **comprehensive syllabus** for the topic: **"${topic}"**.

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
`
}

function getLessonContextPrompt (lessonTitle: string) {
  return `
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
`
}

function getSectionContentPrompt (section: any, context: any) {
  return `
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
`
}

function getQuizPrompt (lessonTitle: string, contentBlocks: any[]) {
  return `
You are an expert quiz generator.

Generate a **high-quality, comprehensive quiz** that tests the learner's understanding of the following lesson content **in depth**.

## 📘 Lesson Content (Reference for Quiz Generation):
${JSON.stringify(contentBlocks)}

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
`
}

function getSummaryPrompt (topic: string) {
  return `
Generate a concise course summary in valid JSON format:
{
  "overview": "Overview...",
  "whatYouLearned": ["Item1", "Item2"],
  "skillsGained": ["Skill1", "Skill2"],
  "nextSteps": ["Next1", "Next2"]
}
4-6 items in each list. Course Title: "${topic}"
`
}

function getKeyPointsPrompt (topic: string) {
  return `
Generate key points in valid JSON:
[
  { "category": "Category Name", "points": ["Point1", "Point2"] }
]
3-4 categories, 4-6 points each. Course Title: "${topic}"
`
}

function getAnalyticsPrompt (topic: string) {
  return `
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
Course Title: "${topic}"
`
}
