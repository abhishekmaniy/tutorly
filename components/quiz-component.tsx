"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Award, ChevronLeft, ChevronRight } from "lucide-react"

interface QuizComponentProps {
  lessonId: number
  onComplete: () => void
}

export function QuizComponent({ lessonId, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())

  // Enhanced quiz data with marking scheme
  const quiz = {
    title: `Lesson ${lessonId} Quiz`,
    totalMarks: 25,
    passingMarks: 15,
    timeLimit: 15, // minutes
    questions: [
      {
        id: 1,
        type: "mcq",
        question: "What is React primarily used for?",
        marks: 5,
        options: [
          "Building databases",
          "Building user interfaces",
          "Server-side programming",
          "Mobile app development only",
        ],
        correctAnswer: 1,
        explanation:
          "React is primarily a JavaScript library for building user interfaces, especially for web applications.",
      },
      {
        id: 2,
        type: "true-false",
        question: "React uses a Virtual DOM to optimize performance.",
        marks: 3,
        correctAnswer: true,
        explanation: "True! React uses a Virtual DOM to minimize direct DOM manipulation and improve performance.",
      },
      {
        id: 3,
        type: "multiple-select",
        question: "Which of the following are key features of React? (Select all that apply)",
        marks: 6,
        options: ["Component-based architecture", "Virtual DOM", "Built-in database", "Declarative programming"],
        correctAnswers: [0, 1, 3],
        explanation:
          "React features component-based architecture, Virtual DOM, and declarative programming. It doesn't have a built-in database.",
      },
      {
        id: 4,
        type: "theoretical",
        question: "Explain the difference between props and state in React. Provide examples to support your answer.",
        marks: 8,
        correctAnswer:
          "Props are read-only data passed from parent to child components, while state is mutable data managed within a component that can change over time.",
        explanation:
          "Props are immutable and flow down from parent components, while state is local to a component and can be updated using setState or hooks.",
        rubric: [
          "Defines props correctly (2 marks)",
          "Defines state correctly (2 marks)",
          "Explains the difference (2 marks)",
          "Provides relevant examples (2 marks)",
        ],
      },
      {
        id: 5,
        type: "mcq",
        question: "Which company originally developed React?",
        marks: 3,
        options: ["Google", "Microsoft", "Facebook (Meta)", "Apple"],
        correctAnswer: 2,
        explanation:
          "React was originally developed by Facebook (now Meta) and is maintained by them along with the open-source community.",
      },
    ],
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const calculateScore = () => {
    let totalMarks = 0
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]

      switch (question.type) {
        case "mcq":
          if (userAnswer === question.correctAnswer) {
            totalMarks += question.marks
          }
          break
        case "true-false":
          if (userAnswer === question.correctAnswer) {
            totalMarks += question.marks
          }
          break
        case "multiple-select":
          if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswers)) {
            const sortedUser = [...userAnswer].sort()
            const sortedCorrect = [...question.correctAnswers].sort()
            if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
              totalMarks += question.marks
            } else {
              // Partial marks for multiple select
              const correctSelected = userAnswer.filter((ans) => question.correctAnswers.includes(ans))
              const partialMarks = (correctSelected.length / question.correctAnswers.length) * question.marks
              totalMarks += Math.floor(partialMarks)
            }
          }
          break
        case "theoretical":
          // For theoretical questions, give marks based on answer length and keywords
          if (userAnswer && userAnswer.trim().length > 50) {
            const keywords = ["props", "state", "component", "parent", "child", "mutable", "immutable"]
            const foundKeywords = keywords.filter((keyword) => userAnswer.toLowerCase().includes(keyword))
            const keywordMarks = Math.min(foundKeywords.length * 1, question.marks * 0.7)
            const lengthMarks = userAnswer.length > 100 ? question.marks * 0.3 : question.marks * 0.1
            totalMarks += Math.floor(keywordMarks + lengthMarks)
          }
          break
      }
    })
    return totalMarks
  }

  const handleSubmit = () => {
    const finalScore = calculateScore()
    const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60) // in minutes
    setScore(finalScore)
    setTimeSpent(timeTaken)
    setShowResults(true)

    // If they passed, mark as complete
    if (finalScore >= quiz.passingMarks) {
      onComplete()
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
    setTimeSpent(0)
  }

  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return { grade: "Outstanding", color: "text-green-600" }
    if (percentage >= 80) return { grade: "Excellent", color: "text-blue-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-yellow-600" }
    if (percentage >= 60) return { grade: "Average", color: "text-orange-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  if (showResults) {
    const gradeInfo = getGrade(score, quiz.totalMarks)
    const percentage = Math.round((score / quiz.totalMarks) * 100)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Award className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {score}/{quiz.totalMarks}
              </div>
              <div className="text-2xl mb-2">
                <span className={gradeInfo.color}>{gradeInfo.grade}</span>
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{percentage}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="text-lg font-semibold">{timeSpent} min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={score >= quiz.passingMarks ? "default" : "destructive"}>
                  {score >= quiz.passingMarks ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                let isCorrect = false

                switch (question.type) {
                  case "mcq":
                  case "true-false":
                    isCorrect = userAnswer === question.correctAnswer
                    break
                  case "multiple-select":
                    if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswers)) {
                      const sortedUser = [...userAnswer].sort()
                      const sortedCorrect = [...question.correctAnswers].sort()
                      isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)
                    }
                    break
                  case "theoretical":
                    isCorrect = userAnswer && userAnswer.trim().length > 50
                    break
                }

                return (
                  <div key={question.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">Question {index + 1}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={resetQuiz} variant="outline">
            Retake Quiz
          </Button>
          <Button onClick={onComplete}>Continue Learning</Button>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="text-right">
          <Badge variant="secondary">{currentQ.marks} marks</Badge>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          {currentQ.type === "theoretical" && currentQ.rubric && (
            <CardDescription>
              <div className="mt-2">
                <p className="font-medium">Marking Rubric:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {currentQ.rubric.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {currentQ.type === "mcq" && (
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
            >
              {currentQ.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`q${currentQ.id}-${index}`} />
                  <Label htmlFor={`q${currentQ.id}-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === "true-false" && (
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`q${currentQ.id}-true`} />
                <Label htmlFor={`q${currentQ.id}-true`} className="cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`q${currentQ.id}-false`} />
                <Label htmlFor={`q${currentQ.id}-false`} className="cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}

          {currentQ.type === "multiple-select" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Select all correct answers:</p>
              {currentQ.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`q${currentQ.id}-${index}`}
                    checked={answers[currentQ.id]?.includes(index) || false}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[currentQ.id] || []
                      if (checked) {
                        handleAnswerChange(currentQ.id, [...currentAnswers, index])
                      } else {
                        handleAnswerChange(
                          currentQ.id,
                          currentAnswers.filter((a: number) => a !== index),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`q${currentQ.id}-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentQ.type === "theoretical" && (
            <div className="space-y-3">
              <Textarea
                placeholder="Write your detailed answer here..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters required. Current: {(answers[currentQ.id] || "").length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!answers[currentQ.id]}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={nextQuestion} disabled={!answers[currentQ.id]}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
