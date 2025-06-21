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
        .replace(/^[^{\[]+/, '')
        .trim()

      text = text.replace(/[\x00-\x1F\x7F]/g, (c: string) =>
        c === '\n' || c === '\t' ? c : ''
      )

      return JSON.parse(text)
    } catch (err) {
      console.warn(`Attempt ${attempt} failed to generate valid JSON:`, err)
      if (attempt === maxRetries)
        throw new Error(`Failed after ${maxRetries} attempts.`)
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
        streamData(
          controller,
          JSON.stringify({ step: 'syllabus', status: 'started' })
        )
        streamData(controller, '📚 Generating syllabus...')
        const syllabusJson = await generateValidJsonWithRetries(
          getSyllabusPrompt(prompt),
          model
        )
        streamData(
          controller,
          JSON.stringify({
            step: 'syllabus',
            status: 'completed',
            data: syllabusJson
          })
        )

        const lessons = []

        for (const lessonObj of syllabusJson.lessons) {
          const lessonTitle = lessonObj.title
          const lessonDuration = lessonObj.duration

          streamData(
            controller,
            JSON.stringify({
              step: 'lesson',
              status: 'started',
              data: { title: lessonTitle }
            })
          )

          const context = await generateValidJsonWithRetries(
            getLessonContextPrompt(lessonTitle),
            model
          )

          // 🎯 NEW → Generate *all* section content in ONE call
          const sectionContent = await generateValidJsonWithRetries(
            getAllSectionsContentPrompt(context),
            model
          )

          const allContentBlocks = []
          for (const section of sectionContent.sections) {
            for (const block of section.contentBlocks) {
              let text = null,
                code = null,
                math = null,
                graph = null
              if (block.type === 'TEXT') text = block.content
              if (block.type === 'CODE') code = block.content
              if (block.type === 'MATH') math = block.content
              if (block.type === 'GRAPH') graph = block.content

              streamData(
                controller,
                JSON.stringify({
                  step: 'contentBlock',
                  lessonTitle,
                  sectionTitle: section.title,
                  contentBlock: {
                    id: crypto.randomUUID(),
                    order: block.order ?? 0,
                    type: block.type,
                    text,
                    code,
                    math,
                    graph
                  }
                })
              )

              allContentBlocks.push(block)
            }
          }

          const quizJson = await generateValidJsonWithRetries(
            getQuizPrompt(lessonTitle, allContentBlocks),
            model
          )
          streamData(
            controller,
            JSON.stringify({
              step: 'quiz',
              status: 'completed',
              data: quizJson
            })
          )

          lessons.push({
            lessonTitle,
            lessonDuration,
            context,
            allContentBlocks,
            quizJson
          })
        }

        // 🎯 NEW → Generate summary, key points & analytics in ONE call
        streamData(controller, '🗂️ Generating post-course content...')
        const postCourse = await generateValidJsonWithRetries(
          getPostCourseDataPrompt(prompt),
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
            summary: { create: postCourse.summary },
            keyPoints: { create: postCourse.keyPoints },
            analytics: { create: postCourse.analytics }
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

// 📘 PROMPT FUNCTIONS

function getSyllabusPrompt (topic: string) {
  return `
You are an expert educational content creator.

🎯 Your task is to generate a **comprehensive syllabus** for the course topic: "${topic}".

⚠️ IMPORTANT INSTRUCTIONS:
- Respond **ONLY with strict JSON**.
- DO NOT include any explanation, introduction, or markdown (no '''json or ''').
- The response MUST start **directly** with '{'.
- NO preface such as "Here is..." or "Sure!".

📚 Output JSON Format:
{
  "title": "Course Title",
  "description": "Concise course description.",
  "lessons": [
    {
      "title": "Lesson Title",
      "duration": "e.g., '10 minutes'"
    }
  ]
}

Generate as many lessons as necessary for a complete learning journey. Make sure the **title** is compelling and the **description** clearly explains what the course covers.

}`
}

function getLessonContextPrompt (lessonTitle: string) {
  return `
You are an expert curriculum designer.

🎯 Your task is to generate the **lesson context** for the lesson titled: "${lessonTitle}".

⚠️ IMPORTANT INSTRUCTIONS:
- Respond **ONLY with strict JSON**.
- DO NOT include any explanation, introduction, or markdown formatting (no '''json or ''').
- The response MUST start **directly** with '{'.
- DO NOT add phrases like "Here is..." or "Sure!".

📚 Output JSON Format:
{
  "title": "${lessonTitle}",
  "objective": "Clear learning objective for this lesson in ONE concise sentence.",
  "sections": [
    {
      "title": "Descriptive Section Heading",
      "description": "1-2 sentence description of what this section will cover."
    }
  ]
}

✅ Ensure that:
- The **objective** describes the *learner’s outcome* clearly and concisely.
- Each **section** logically contributes to achieving the objective.
- Generate as many sections as required for a complete understanding of the lesson.

- Each section should focus on ONE major subtopic or concept.
- Make section titles engaging, actionable, or thought-provoking if suitable.

  `
}

function getAllSectionsContentPrompt (context: any) {
  return `
You are an expert lesson content creator.

🎯 Your task is to generate **detailed educational content** for **all sections** of the lesson: "${context.title}"

📖 **Lesson Context**: "${context.objective}"

⚠️ IMPORTANT INSTRUCTIONS:
- Respond **ONLY with strict JSON**.
- DO NOT include any introduction, explanation, or markdown formatting (no '''json or ''').
- The response MUST start **directly** with '{'.
- DO NOT include phrases like "Here is..." or "Sure!".

📚 **Required JSON Format**:
{
  "sections": [
    {
      "title": "Section Title",
      "contentBlocks": [
        {
          "type": "TEXT" | "CODE" | "MATH" | "GRAPH",
          "content": "Detailed content here."
        }
      ]
    }
  ]
}

✅ **Content Guidelines**:
- Include **all sections** from the lesson context.
- Each **section** should have multiple **contentBlocks** arranged in a **logical teaching order**.
- Use **"TEXT"** for explanations, **"CODE"** for programming examples, **"MATH"** for formulas, and **"GRAPH"** for diagrams (describe in text what the graph should represent).
- **Combine different types where appropriate** to enhance understanding (e.g., a "TEXT" explanation followed by a "CODE" or "MATH" block).
- The content should **flow naturally** and progressively build the learner’s understanding.

- Make contentBlocks substantial and informative.
- Use clear, instructional writing in "TEXT" blocks.
- Ensure technical accuracy in "CODE" and "MATH" blocks.


`
}

function getQuizPrompt (lessonTitle: string, contentBlocks: any[]) {
  return `
You are an expert quiz generator.

🎯 Your task is to generate a **high-quality quiz** for the lesson: "${lessonTitle}".

📖 **Lesson Content** (reference for generating questions): 
${JSON.stringify(contentBlocks)}

⚠️ IMPORTANT INSTRUCTIONS:
- Respond **ONLY with strict JSON**.
- DO NOT include any explanation, introduction, or markdown formatting (no '''json or ''').
- The response MUST start **directly** with '{'.
- DO NOT include phrases like "Here is..." or "Sure!".

📚 **Required JSON Format**:
{
  "title": "Quiz for ${lessonTitle}",
  "duration": "10 minutes",
  "totalMarks": 50,
  "passingMarks": 30,
  "status": "NOT_STARTED",
  "questions": [
    {
      "number": 1,
      "question": "Clear, specific, and unambiguous question based strictly on the lesson content.",
      "type": "MCQ" | "MULTIPLE_SELECT" | "DESCRIPTIVE" | "TRUE_FALSE",
      "options": ["A", "B", "C", "D"],        // Required for MCQ & MULTIPLE_SELECT only
      "marks": 10,
      "correctAnswers": ["A"],                // Required for all EXCEPT DESCRIPTIVE
      "explanation": "Concise explanation of why the correct answer(s) is correct.",
      "rubric": ["Point 1", "Point 2"]        // REQUIRED for DESCRIPTIVE questions only
    }
  ]
}

✅ **Question Guidelines**:
- Include a **balanced mix** of question types (**MCQ**, **MULTIPLE_SELECT**, **TRUE_FALSE**, and **DESCRIPTIVE** when appropriate).
- Questions **must** directly relate to and test understanding of the provided lesson content.
- **Ensure clarity**—avoid vague or ambiguous questions.
- **For DESCRIPTIVE questions**, provide a **grading rubric** with key points that should be included in an excellent answer.

Generate enough questions to meaningfully assess the learner’s understanding of the lesson.
 
- Include a mix of easy, moderate, and challenging questions.
- Ensure no two questions test the exact same concept.
- When using MCQs, avoid obviously incorrect distractor options.


`
}

function getPostCourseDataPrompt (topic: string) {
  return `
You are an expert educational analyst and instructional designer.

🎯 Your task is to generate the **summary**, **key points**, and **analytics** for the course: "${topic}"

⚠️ IMPORTANT INSTRUCTIONS:
- Respond **ONLY with strict JSON**.
- DO NOT include any introduction, explanation, or markdown formatting (no '''json or ''').
- The response MUST start **directly** with '{'.
- DO NOT include phrases like "Here is..." or "Sure!".

📚 **Required JSON Format**:
{
  "summary": {
    "overview": "Concise overview of the course content and its purpose (2-3 sentences).",
    "whatYouLearned": ["Key knowledge areas or concepts covered in the course."],
    "skillsGained": ["Practical or conceptual skills the learner gained."],
    "nextSteps": ["Recommended further topics, skills, or resources the learner should explore."]
  },
  "keyPoints": [
    {
      "category": "Category Name (e.g., Core Concepts, Best Practices, Tools Used)",
      "points": ["Important point 1", "Important point 2", "Important point 3"]
    }
  ],
  "analytics": {
    "timeSpentTotal": float,           // Total time spent on the course in minutes
    "timeSpentLessons": float,         // Time spent on lessons in minutes
    "timeSpentQuizzes": float,         // Time spent on quizzes in minutes
    "averageScore": float,             // Average quiz score percentage (0-100)
    "totalQuizzes": integer,           // Total number of quizzes in the course
    "passedQuizzes": integer,          // Number of quizzes successfully passed
    "grade": "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT", // Overall learner performance grade
    "lessonsCompleted": integer,       // Number of lessons completed by the learner
    "quizzesCompleted": integer,       // Number of quizzes completed by the learner
    "totalLessons": integer            // Total number of lessons in the course
  }
}

✅ **Content Guidelines**:
- The **overview** should provide a clear summary of what the course offered.
- **whatYouLearned** should highlight major concepts and knowledge areas.
- **skillsGained** should list *practical* abilities or understandings acquired.
- **nextSteps** should guide the learner on *how to advance further* in this subject.
- **keyPoints** should summarize the *essential takeaways* by category.
- **analytics** should include **realistic, coherent numbers** representing learner engagement and performance.

Respond with **complete** and **high-quality** content for each section.


  `
}
