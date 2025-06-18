import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export const POST = async (req: NextRequest) => {
  try {
    const { answer, marks, rubric, question } = await req.json()  // ✅ Fix: req.body() → await req.json()

    const ai = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })  // ✅ Use latest if supported

    const prompt = `
You are acting as an exam evaluator for descriptive answers. Follow these rules carefully:

1️⃣ **Question**: ${question}
2️⃣ **Maximum Marks**: ${marks}
3️⃣ **Rubric**: ${Array.isArray(rubric) ? rubric.join(', ') : rubric}
4️⃣ **Student Answer**: ${answer}

➡ Your Task:
- Evaluate the answer strictly based on the rubric and the completeness of the response.
- Think critically about depth, clarity, relevance.
- Do not explain anything, **output ONLY the awarded marks as a number between 0 and ${marks}**. Example output: 7

Output **only** the number (e.g., 5 or 9), nothing else.
`

    const result = await model.generateContent(prompt)
    const rawText = result.response.text().trim()

    // ✅ Extract numeric part, fallback to 0 if parsing fails
    const extractedMarks = parseInt(rawText.match(/\d+/)?.[0] || '0', 10)

    return NextResponse.json({ status: 200, marks: extractedMarks })
  } catch (error) {
    console.error('Error evaluating descriptive answer:', error)
    return NextResponse.json({ status: 500, error: 'Failed to evaluate answer' })
  }
}
