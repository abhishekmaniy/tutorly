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

export async function POST (req: pcoursNextRequest) {
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
        const createdCourse = await db.course.create({
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
                    questions: {
                      create: l.quizJson.questions.map((q: any) => ({
                        number: q.number,
                        question: q.question,
                        type: q.type,
                        options: q.options ?? [],
                        marks: q.marks,
                        correctAnswers: q.correctAnswers ?? [],
                        explanation:
                          q.explanation ?? 'Explanation not provided.', // 👈 Provide fallback if missing
                        rubric: q.rubric ?? []
                      }))
                    }
                  }
                }
              }))
            },
            summary: { create: postCourse.summary },
            keyPoints: { create: postCourse.keyPoints },
            analytics: { create: postCourse.analytics }
          }
        })

        streamData(
          controller,
          JSON.stringify({ step: 'completed', courseId: createdCourse.id })
        )

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

🎯 Your task is to generate a STRICTLY VALID JSON syllabus for the course topic: "${topic}".

⚠️ CRITICAL RULES — Follow strictly:

Output STRICT VALID JSON.

The response MUST start directly with '{' and end with '}'.

NO explanations, introductions, markdown, comments, or code block syntax.

NO extra whitespace outside the JSON.

NO null, undefined, or empty string ("") values. If a value is unknown, OMIT the field entirely.

Escape any special characters properly to maintain valid JSON (e.g., quotes within strings must be escaped: \").

All strings must be double-quoted.

If you make a mistake in JSON, repair the JSON before responding.

📚 Required JSON Format (strict):
{
"title": "Concise, compelling course title",
"description": "1-2 sentence clear explanation of what the course covers.",
"lessons": [
{
"title": "Lesson Title (clear and engaging, no numbering like 'Lesson 1')",
"duration": "e.g., '10 minutes' or '1 hour 15 minutes'"
}
// Add as many lessons as needed for a full learning journey.
]
}

Example:
{
"title": "Mastering Digital Marketing",
"description": "Learn how to effectively promote products and services online using proven digital marketing strategies.",
"lessons": [
{
"title": "Introduction to Digital Marketing",
"duration": "10 minutes"
},
{
"title": "SEO Basics for Website Optimization",
"duration": "20 minutes"
}
]
}

Generate a complete syllabus with as many lessons as necessary for a full, well-rounded educational experience.
}`
}

function getLessonContextPrompt (lessonTitle: string) {
  return `
You are an expert curriculum designer.

🎯 Your task is to generate a STRICTLY VALID JSON lesson object for the lesson titled: "${lessonTitle}".

⚠️ STRICT RULES — Follow exactly:

Respond ONLY with valid JSON. The output MUST start directly with { and end with }.

NO markdown formatting, NO explanations, NO introductions.

NO empty strings, nulls, or undefined values. If you don't know a value, OMIT the field entirely.

Properly escape any special characters in strings (e.g., \" for quotes inside text).

Strings must be double-quoted.

If the JSON is invalid, REPAIR it before submitting.

📚 Output JSON Format (REQUIRED):
{
"title": "${lessonTitle}",
"objective": "One clear, concise learning objective describing what the learner will achieve after completing this lesson.",
"sections": [
{
"title": "Clear, descriptive, and engaging section heading",
"description": "1–2 sentence explanation of what this section covers, clearly contributing to the lesson’s objective."
}
// Add as many sections as necessary for complete understanding.
]
}

✅ Instructions for content generation:

Make sure the objective describes what the learner will be able to do/know/understand by the end of this lesson.

Each section should be unique, focusing on ONE core subtopic or key concept.

Do not use numbering in section titles (e.g., no "Section 1").

No placeholders like "To be filled"—all fields must be fully completed.

📌 Example (structure only, not content):
{
"title": "Understanding Digital Marketing Funnels",
"objective": "Understand how marketing funnels guide potential customers from awareness to conversion.",
"sections": [
{
"title": "Introduction to Funnels",
"description": "Learn what a marketing funnel is and why it’s important for guiding customer journeys."
},
{
"title": "Stages of a Funnel",
"description": "Explore each key stage in a funnel, from awareness to post-purchase engagement."
}
]
}

Generate as many sections as required to ensure learners fully grasp the lesson topic.

  `
}

function getAllSectionsContentPrompt (context: any) {
  return `
You are an expert lesson content creator.

🎯 Your task is to generate detailed educational content for all sections of the lesson titled: "${context.title}"

📖 Lesson Objective: "${context.objective}"

⚠️ STRICT JSON ONLY — Follow these formatting instructions exactly:

✅ Start the response directly with { — no introductory text, no explanation, no markdown formatting.

✅ DO NOT include any phrases like "Here is..." or "Sure!".

✅ All property names and string values must be enclosed in double quotes ("").

✅ DO NOT omit commas between JSON fields, and DO NOT include trailing commas.

✅ Escape any embedded quotes properly with \" if necessary.

❗ If you are unable to generate the JSON properly for any reason, respond ONLY with {}.

📚 REQUIRED JSON FORMAT:

json
Copy
Edit
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
✅ Content Guidelines (Strictly Follow):

Include all sections related to the lesson context.

Each section must have at least 1 or more contentBlocks arranged in logical teaching order.

Use the appropriate type:

"TEXT" ➔ Explanations, conceptual overviews, descriptions.

"CODE" ➔ Programming code or configuration examples.

"MATH" ➔ Mathematical formulas or expressions.

"GRAPH" ➔ Diagrams or visual explanations (describe in text what the graph should show).

Combine multiple types in a section when appropriate (Example: "TEXT" ➔ "CODE" ➔ "GRAPH" in sequence for better understanding).

Write clear, coherent, and educational content. Avoid short or incomplete explanations.

Make contentBlocks substantial—each should help the learner fully grasp that part of the section.

Ensure logical flow across the sections to support progressive understanding of the lesson.

⚙️ Example of Good Structure (for reference only, DO NOT include this in your response):

json
Copy
Edit
{
  "sections": [
    {
      "title": "Understanding Functions in JavaScript",
      "contentBlocks": [
        {
          "type": "TEXT",
          "content": "Functions allow you to reuse blocks of code by encapsulating functionality into callable units."
        },
        {
          "type": "CODE",
          "content": "function greet(name) {\n  return 'Hello, ${name}!';\n}"
        }
      ]
    }
  ]
}
🔒 STRICT JSON FORMAT REQUIRED. Respond now with the completed JSON. If unsure, respond with '{}' only.
`
}

function getQuizPrompt (lessonTitle: string, contentBlocks: any[]) {
  return `
You are an expert quiz generator with advanced knowledge of assessment design.

🎯 Your task is to generate a STRICTLY VALID JSON quiz for the lesson titled: "${lessonTitle}"

📖 Lesson Content (reference for generating questions):

json
Copy
Edit
${JSON.stringify(contentBlocks)}
⚠️ IMPORTANT FORMATTING RULES (MANDATORY):

Respond ONLY with strictly valid JSON. The output MUST start directly with { and end with }.

NO explanations, introductions, or markdown formatting.

DO NOT include phrases like "Here is..." or "Sure!".

All property names and string values MUST use double quotes ("").

DO NOT leave out commas.

DO NOT include trailing commas.

If you cannot generate STRICT JSON, respond with '{}'.

Escape any special characters properly (e.g., use \" for embedded quotes).

📚 Output JSON Format (STRICTLY REQUIRED):

json
Copy
Edit
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
      "options": ["A", "B", "C", "D"],      // REQUIRED for MCQ & MULTIPLE_SELECT only
      "marks": 10,
      "correctAnswers": ["A"],              // REQUIRED for all EXCEPT DESCRIPTIVE
      "explanation": "Short explanation of why the answer is correct.", // REQUIRED for all except DESCRIPTIVE
      "rubric": ["Point 1", "Point 2"]      // REQUIRED for DESCRIPTIVE only
    }
  ]
}
✅ Instructions for Generating Quiz Questions:

Provide 5 to 8 meaningful questions to test understanding of the lesson.

Balance the quiz with different question types:

MCQ: Single correct answer.

MULTIPLE_SELECT: Multiple correct options.

TRUE_FALSE: Only "True" or "False" as options.

DESCRIPTIVE: Requires a grading rubric with at least 2 key points.

MCQ & MULTIPLE_SELECT must include 4 plausible, realistic options. Avoid obviously wrong choices.

For DESCRIPTIVE questions, provide a grading rubric — a list of specific key points learners should cover.

Ensure clarity and direct relevance to the lesson content.

Avoid duplicate or repetitive questions.

📌 Validation and Quality Rules:

All objects and arrays must be fully populated and syntactically correct.

If any part of the JSON would be invalid, REPAIR it before responding.

Each "number" must be sequential, starting from 1.

Every question must have the "marks" field, and all marks should add up to "totalMarks".

Preferably mix easy, medium, and challenging questions.

🔒 STRICT JSON COMPLIANCE REQUIRED.

If you fully understand the lesson content and the JSON format, begin generating now.

`
}

function getPostCourseDataPrompt (topic: string) {
  return `
You are an expert educational analyst and instructional designer.

🎯 Your task is to generate a strictly valid JSON object representing the summary, key points, and analytics for the course titled: "${topic}"

📖 The JSON must follow this exact schema:

json
Copy
Edit
{
  "summary": {
    "overview": "2-3 sentence overview of the course content and its purpose.",
    "whatYouLearned": ["Concept 1", "Concept 2", "Concept 3"],
    "skillsGained": ["Skill 1", "Skill 2", "Skill 3"],
    "nextSteps": ["Recommended next topic 1", "Recommended next topic 2"]
  },
  "keyPoints": [
    {
      "category": "e.g., Core Concepts, Best Practices, Tools Used",
      "points": ["Important point 1", "Important point 2", "Important point 3"]
    }
  ],
  "analytics": {
    "timeSpentTotal": float,           // Total time spent on the course in minutes (e.g., 120.5)
    "timeSpentLessons": float,         // Time spent on lessons in minutes (e.g., 90.0)
    "timeSpentQuizzes": float,         // Time spent on quizzes in minutes (e.g., 30.5)
    "averageScore": float,             // Average quiz score percentage (0 to 100)
    "totalQuizzes": integer,           // Total number of quizzes in the course
    "passedQuizzes": integer,          // Number of quizzes passed successfully
    "grade": "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT",
    "lessonsCompleted": integer,       // Number of lessons completed
    "quizzesCompleted": integer,       // Number of quizzes completed
    "totalLessons": integer            // Total number of lessons in the course
  }
}
⚠️ STRICT FORMATTING RULES (MANDATORY):

Respond ONLY with valid JSON — starting with { and ending with }.

NO introduction, explanation, or markdown formatting.

DO NOT include phrases like "Here is..." or "Sure!".

All property names and string values must be enclosed in double quotes ("").

Do not omit commas or include trailing commas.

Escape embedded quotes properly (use \" where needed).

If you cannot generate STRICT JSON, respond with '{}'.

✅ Content Guidelines:

"overview": Provide a concise and meaningful description of the course purpose.

"whatYouLearned": Major concepts/knowledge areas covered in the course.

"skillsGained": Practical skills or conceptual abilities acquired.

"nextSteps": Suggestions for advancing knowledge or skills beyond this course.

"keyPoints":

Each key point must be relevant and actionable.

Include at least 3 points per category.

"analytics":

Numbers must be realistic and coherent.

Example: timeSpentTotal = timeSpentLessons + timeSpentQuizzes

"averageScore" should realistically correspond to "grade" (e.g., if "grade": "GOOD", "averageScore" should be around 70-80).

⚠️ Validation Rules (Critical):

Ensure that ALL fields are present, even if empty arrays are required.

Use realistic float values for time (e.g., 120.5) — NOT strings.

grade must be one of: "EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT"

🔒 STRICT JSON COMPLIANCE REQUIRED.

Begin generating the JSON now if you fully understand these instructions.
  `
}
