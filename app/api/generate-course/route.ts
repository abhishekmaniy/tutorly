import { db } from '@/lib/db'
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

Generate a **concise syllabus** for the topic: **"${prompt}"**.

## 📚 Requirements:
- **Adjust lesson depth and count** based on **user's intent**:
  - If the topic or query suggests **"deep"** or **"comprehensive"** learning → generate **6-8 lessons**.
  - If the topic suggests **"introductory"**, **"overview"**, or **"quick guide"** → generate **3-4 lessons**.
  - If user intent is **unspecified**, generate **4-6 lessons**.

## 📦 JSON Format (Strict):
Return **ONLY** a **valid JSON object** matching this structure:
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
- Make lesson titles **clear and focused**.
- Lesson **duration** should reflect content depth (e.g., deeper topics → longer durations).
- **No explanations outside JSON. No markdown. No links.**
- **Return ONLY the JSON object.**

`,
      model
    )

    const lessons = []
    for (const lessonObj of syllabusJson.lessons) {
      const lessonTitle = lessonObj.title
      const lessonDuration = lessonObj.duration

      // 2️⃣ Generate Lesson Content
      const lessonJson = await generateValidJson(
        `
You are an expert lesson content creator.

Generate a **detailed, comprehensive, and well-structured lesson** on the topic: **"${lessonTitle}"**.  
The lesson must cover the topic **thoroughly**, providing **all relevant information, context, explanations, and examples** necessary for a learner to fully understand the subject.

## 📦 Output Format:
Return ONLY a **valid JSON object** matching this structure:
{
  "title": "${lessonTitle}",
  "description": "Clear, concise overview of the lesson in **1-2 sentences** using proper markdown.",
  "contentBlocks": [
    {
      "type": "TEXT" | "CODE" | "MATH" | "GRAPH",
      "order": number, // Sequential, starting from 1
      "content": string | object // Depends on type (see below)
    }
  ]
}

## 📚 Content Block Types:

1️⃣ **TEXT** → Well-written markdown explanations.
- Use **headings** (#, ##, ###), **bold**, \`inline code\`, lists, and paragraphs.
- **Include in-depth explanations, real-world applications, comparisons, and key takeaways.**

2️⃣ **CODE** → Practical, **fully working** code snippets with syntax highlighting.
- Must use triple backticks with language tag. Example:
\`\`\`js
const a = 5;
\`\`\`
- **Explain the code in surrounding TEXT blocks.**

3️⃣ **MATH** → Mathematical expressions or formulas.
- Inline: \`$E = mc^2$\`
- Block:
\`\`\`
$$
a^2 + b^2 = c^2
$$
\`\`\`
- Use **if** applicable to the topic.

4️⃣ **GRAPH** → JSON representation of related data structures or processes (e.g., flow diagrams, network graphs).
- Example:
{
  "nodes": [{ "id": "A" }, { "id": "B" }],
  "edges": [{ "from": "A", "to": "B" }]
}

## ✅ Requirements:
- Provide **5 to 7 content blocks** if the topic is complex; **4 to 5 blocks** for simpler topics.
- Must **combine multiple types** — at least **1 TEXT** block and **1 CODE** or **MATH** block mandatory.
- Ensure a **logical, educational progression** from introduction → explanation → examples → summary.
- **Avoid repetition.**
- **No links, no images, no explanations outside the JSON.**
- **Return ONLY the JSON object.**

`,
        model
      )

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

      lessons.push({
        title: lessonJson.title,
        description: lessonJson.description,
        contentBlocks: lessonJson.contentBlocks, // ✅ FIXED: this was missing
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
                (block: any, blockIdx: number) => ({
                  order: block.order || blockIdx + 1,
                  type: block.type,
                  code:
                    block.type === 'CODE' ? String(block.content) : undefined,
                  math:
                    block.type === 'MATH' ? String(block.content) : undefined,
                  graph: block.type === 'GRAPH' ? block.content : undefined,
                  text:
                    block.type === 'TEXT' ? String(block.content) : undefined
                })
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
