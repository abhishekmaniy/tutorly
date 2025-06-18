'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@/lib/types'
import axios from 'axios'
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import ShowResult from './ShowResult'

interface QuizComponentProps {
  lessonId: string
  onComplete: () => void
  course: Course
}

export function QuizComponent ({
  lessonId,
  onComplete,
  course
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())

  const lessons = course.lessons
  const lesson = lessons.filter(lesson => lesson.id === lessonId)[0]
  const quiz = lesson?.quizz

  // Enhanced quiz data with marking scheme
  

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = async () => {
    let totalMarks = 0

    if (!quiz?.questions) return totalMarks

    for (const question of quiz.questions) {
      const questionId = question.id
      const optionNumber = answers[questionId]

      let userAnswer

      if (typeof optionNumber === 'number' && question?.options) {
        userAnswer = question.options[optionNumber]
      } else {
        userAnswer = answers[questionId]
      }

      switch (question.type) {
        case 'MCQ':
          if (userAnswer === question?.correctAnswers[0]) {
            totalMarks += question.marks
          }
          break

        case 'TRUE_FALSE':
          if (
            userAnswer?.toString().toUpperCase() === question?.correctAnswers[0]
          ) {
            totalMarks += question.marks
          }
          break

        case 'MULTIPLE_SELECT':
          if (
            Array.isArray(userAnswer) &&
            Array.isArray(question.correctAnswers)
          ) {
            const selectedOptions = userAnswer.map(
              index => question.options[index]
            )

            const sortedUser = [...selectedOptions].sort()
            const sortedCorrect = [...question.correctAnswers].sort()

            if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
              totalMarks += question.marks
            } else {
              const correctSelected = selectedOptions.filter(ans =>
                question.correctAnswers.includes(ans)
              )
              const partialMarks =
                (correctSelected.length / question.correctAnswers.length) *
                question.marks
              totalMarks += Math.floor(partialMarks)
            }
          }
          break

        case 'DESCRIPTIVE':
          if (userAnswer && userAnswer.trim().length > 0) {
            try {
              const response = await axios.post('/api/check-answer', {
                answer: userAnswer,
                marks: question.marks,
                rubric: question.rubric,
                question: question.question
              })

              const awardedMarks = response.data.marks ?? 0
              totalMarks += awardedMarks
            } catch (error) {
              console.error('Error checking descriptive answer:', error)
            }
          }
          break
      }
    }

    return totalMarks
  }

  const handleSubmit = async () => {
    const finalScore = await calculateScore()
    const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60) // in minutes
    setScore(finalScore)
    setTimeSpent(timeTaken)
    setShowResults(true)

    await axios.post('/api/complete-quiz', {
      quizId: quiz?.id,
      courseId: course?.id
    })

    // If they passed, mark as complete
    if (finalScore >= quiz?.passingMarks!) {
      onComplete()
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz?.questions?.length!) {
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

  if (showResults) {
    return (
      <ShowResult
        score={score}
        quiz={quiz!}
        timeSpent={timeSpent}
        answers={answers}
        resetQuiz={resetQuiz}
        onComplete={onComplete}
      />
    )
  }

  const currentQ = quiz?.questions.filter(
    question => question.number === currentQuestion
  )[0]
  const progress = (currentQuestion / quiz?.questions?.length!) * 100

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>{quiz?.title}</h2>
          <p className='text-muted-foreground'>
            Question {currentQuestion} of {quiz?.questions?.length}
          </p>
        </div>
        <div className='text-right'>
          <Badge variant='secondary'>{currentQ?.marks} marks</Badge>
        </div>
      </div>

      <Progress value={progress} className='h-2' />

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>{currentQ?.question!}</CardTitle>
          {currentQ?.type! === 'DESCRIPTIVE' && currentQ?.rubric! && (
            <CardDescription>
              <div className='mt-2'>
                <p className='font-medium'>Marking Rubric:</p>
                <ul className='list-disc list-inside text-sm mt-1'>
                  {currentQ.rubric.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {currentQ?.type === 'MCQ' && (
            <RadioGroup
              value={answers[currentQ?.id]?.toString()}
              onValueChange={value =>
                handleAnswerChange(currentQ?.id, Number.parseInt(value))
              }
            >
              {currentQ.options.map((option: string, index: number) => (
                <div key={index} className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value={index.toString()}
                    id={`q${currentQ.id}-${index}`}
                  />
                  <Label
                    htmlFor={`q${currentQ.id}-${index}`}
                    className='flex-1 cursor-pointer'
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ?.type === 'TRUE_FALSE' && (
            <RadioGroup
              value={answers[currentQ?.id]?.toString()}
              onValueChange={value =>
                handleAnswerChange(currentQ?.id, value === 'true')
              }
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='true' id={`q${currentQ.id}-true`} />
                <Label
                  htmlFor={`q${currentQ.id}-true`}
                  className='cursor-pointer'
                >
                  True
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='false' id={`q${currentQ.id}-false`} />
                <Label
                  htmlFor={`q${currentQ.id}-false`}
                  className='cursor-pointer'
                >
                  False
                </Label>
              </div>
            </RadioGroup>
          )}

          {currentQ?.type === 'MULTIPLE_SELECT' && (
            <div className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Select all correct answers:
              </p>
              {currentQ.options.map((option: string, index: number) => (
                <div key={index} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`q${currentQ.id}-${index}`}
                    checked={answers[currentQ.id]?.includes(index) || false}
                    onCheckedChange={checked => {
                      const currentAnswers = answers[currentQ.id] || []
                      if (checked) {
                        handleAnswerChange(currentQ.id, [
                          ...currentAnswers,
                          index
                        ])
                      } else {
                        handleAnswerChange(
                          currentQ.id,
                          currentAnswers.filter((a: number) => a !== index)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`q${currentQ.id}-${index}`}
                    className='flex-1 cursor-pointer'
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentQ?.type === 'DESCRIPTIVE' && (
            <div className='space-y-3'>
              <Textarea
                placeholder='Write your detailed answer here...'
                value={answers[currentQ.id] || ''}
                onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                className='min-h-[150px]'
              />
              <p className='text-xs text-muted-foreground'>
                Minimum 50 characters required. Current:{' '}
                {(answers[currentQ.id] || '').length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex justify-between'>
        <Button
          variant='outline'
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Previous
        </Button>

        {currentQuestion === quiz.questions.length ? (
          <Button
            onClick={handleSubmit}
            disabled={!answers.hasOwnProperty(currentQ?.id!)}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={!answers.hasOwnProperty(currentQ?.id!)}
          >
            Next
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
