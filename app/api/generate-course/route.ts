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
You are an expert educational content generator.
Generate a detailed syllabus in valid JSON format for the following topic.
{
  "title": "Course Title",
  "description": "Detailed description...",
  "lessons": [
    {
      "title": "Lesson Title",
      "duration": "e.g., '10 minutes'"
    }
  ]
}
Constraints: 4-6 lessons. Return ONLY JSON.
Topic: ${prompt}
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

Generate detailed, well-structured lesson content for the topic: "${lessonTitle}".

## ✅ Important instructions:

- **Return ONLY a valid JSON object** in the specified structure.
- **NO images, NO links, NO image URLs.** Text content only.
- Structure all lesson content using **valid markdown**:
  - **Headings**: #, ##, ### as appropriate
  - **Bold**: Use **double asterisks** for emphasis
  - **Inline Code**: Use \`backticks\` for inline code references
  - **Code Blocks**: Use triple backticks \`\`\` with a language specifier (e.g., \`\`\`js, \`\`\`python, \`\`\`html)
  
Example:

\`\`\`js
const button = document.getElementById("btn");
button.addEventListener("click", () => alert("Clicked!"));
\`\`\`

- **Mathematical Expressions** (if needed):
  - Inline: \`$E = mc^2$\`
  - Block: 
\`\`\`
$$
a^2 + b^2 = c^2
$$
\`\`\`

- Avoid writing things like "Example HTML:" → Just provide the content using **proper markdown**.

## 📦 Output Format (Strict):

{
  "title": "${lessonTitle}",
  "description": "Detailed lesson description with proper markdown formatting.",
  "content": "Full lesson content formatted using markdown. Use **headings**, \`inline code\`, code blocks with language, **bold text**, lists, and math expressions as explained above. DO NOT include any links or image URLs."
}

Return ONLY the JSON. Do NOT include explanations or comments outside the JSON.
`,
        model
      )

      // 3️⃣ Generate Quiz
      const quizJson = await generateValidJson(
        `
You are an expert quiz generator.
Generate a **high-quality** quiz for the topic **"${lessonTitle}"** in **valid JSON format** matching this structure:

{
  "title": "${lessonTitle} Quiz",
  "duration": "e.g., '10 minutes'",
  "totalMarks": 50,
  "passingMarks": 30,
  "status": "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED", // use appropriate starting status
  "questions": [
    {
      "number": 1, // question number starting from 1
      "question": "Write a clear, concise question related to '${lessonTitle}'.",
      "type": "MCQ" | "MULTIPLE_SELECT" | "DESCRIPTIVE" | "TRUE_FALSE",
      "options": ["Option1", "Option2"], // Optional for DESCRIPTIVE
      "marks": 10,
      "correctAnswers": ["Answer1", "Answer2"], // For MCQ, TRUE_FALSE, MULTIPLE_SELECT
      "explanation": "Explain why this is the correct answer.",
      "rubric": ["Point 1 for mentioning X", "Point 2 for covering Y"] // Only for DESCRIPTIVE
    }
  ]
}

Guidelines:
- Generate at least **5 questions**
- Mix of types: MCQ, MULTIPLE_SELECT, TRUE_FALSE, and at least 1 DESCRIPTIVE
- 'totalMarks' = **sum of 'marks'** of all questions
- 'passingMarks' ≈ 60% of totalMarks
- DESCRIPTIVE questions must include a meaningful **rubric**
- Make sure 'correctAnswers' corresponds accurately to 'options' (where applicable)
- Use **number** for the question order, starting from 1
- 'status' field should be provided (default is usually 'NOT_STARTED')

Return **ONLY VALID JSON**. No markdown, no explanations outside JSON.
  `,
        model
      )

      lessons.push({
        title: lessonJson.title,
        description: lessonJson.description,
        content: lessonJson.content,
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
  {
    "category": "Category Name",
    "points": ["Point1", "Point2"]
  }
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
            content: lessonData.content,
            description: lessonData.description,
            duration: lessonData.duration,
            order: idx,
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
        lessons: { include: { quizz: { include: { questions: true } } } },
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
