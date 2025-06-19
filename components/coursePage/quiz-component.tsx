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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ShowResult from './ShowResult'
import { useStore } from '@/store/store'

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
  const lesson = course.lessons.find(lesson => lesson.id === lessonId)
  const quiz = lesson?.quizz

  console.log(course)

  console.log(quiz?.isCompleted)

  const [showResults, setShowResults] = useState(quiz?.isCompleted || false)
  const [score, setScore] = useState(quiz?.gainedMarks || 0)
  const [timeSpent, setTimeSpent] = useState(quiz?.timeTaken || 0)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [hasStarted, setHasStarted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const { updateCourse } = useStore()


  console.log(showResults)

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  useEffect(() => {
    if (hasStarted) {
      setStartTime(Date.now())
    }
  }, [hasStarted])

  useEffect(() => {
    const selectedLesson = course.lessons.find(lesson => lesson.id === lessonId)
    const selectedQuiz = selectedLesson?.quizz

    console.log(selectedQuiz?.isCompleted)

    setShowResults(selectedQuiz?.isCompleted || false)
    setScore(selectedQuiz?.gainedMarks || 0)
    setTimeSpent(selectedQuiz?.timeTaken || 0)
    setCurrentQuestion(1)
    setAnswers({})
    setHasStarted(false)
    setCountdown(null)
    setStartTime(null)
  }, [lessonId, course])

  if (showResults) {
    return (
      <ShowResult
        score={score}
        quiz={quiz!}
        timeSpent={timeSpent}
        answers={answers}
        resetQuiz={() => {
          setCurrentQuestion(1)
          setAnswers({})
          setShowResults(false)
          setScore(0)
          setTimeSpent(0)
        }}
        onComplete={onComplete}
      />
    )
  }

  const startQuiz = () => {
    setCountdown(3)
    let counter = 3
    const countdownInterval = setInterval(() => {
      counter--
      if (counter === 0) {
        clearInterval(countdownInterval)
        setHasStarted(true)
        setCountdown(null)
      } else {
        setCountdown(counter)
      }
    }, 1000)
  }

  const handleSubmit = async () => {
    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime) / 1000 / 60)
      : 0
    setTimeSpent(timeTaken)
    await axios.post('/api/complete-quiz', {
      quizId: quiz?.id,
      courseId: course?.id,
      timeTaken,
      answers
    })
    const response = await axios.get(`/api/course?id=${course?.id}`)

    updateCourse(response.data)
    setShowResults(true)

    onComplete()
  }

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions?.length || 0)) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(1)
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

  const currentQ = quiz?.questions.find(q => q.number === currentQuestion)
  const progress =
    ((currentQuestion - 1) / (quiz?.questions?.length || 1)) * 100

  if (!hasStarted) {
    return countdown !== null ? (
      <div className='flex items-center justify-center h-96 text-6xl font-bold animate-pulse'>
        {countdown === 0 ? 'GO!' : countdown}
      </div>
    ) : (
      <div className='space-y-6 p-4'>
        <h2 className='text-2xl font-bold'>Quiz Instructions</h2>
        <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
          <li>Do not close or refresh the window during the quiz.</li>
          <li>You are not allowed to cheat during the quiz.</li>
          <li>Closing the quiz will be considered as forfeiting.</li>
          <li>Make sure to answer all questions before submitting.</li>
        </ul>
        <Button onClick={startQuiz} size='lg'>
          Start Quiz
        </Button>
      </div>
    )
  }

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
          <CardTitle className='text-lg'>{currentQ?.question}</CardTitle>
          {currentQ?.type === 'DESCRIPTIVE' && currentQ.rubric && (
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
              value={answers[currentQ.id]?.toString()}
              onValueChange={value =>
                handleAnswerChange(currentQ.id, Number(value))
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
              value={answers[currentQ.id]?.toString()}
              onValueChange={value =>
                handleAnswerChange(currentQ.id, value === 'true')
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
          disabled={currentQuestion === 1}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Previous
        </Button>

        {currentQuestion === quiz?.questions?.length ? (
          <Button
            onClick={handleSubmit}
            disabled={!answers.hasOwnProperty(currentQ?.id || '')}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={!answers.hasOwnProperty(currentQ?.id || '')}
          >
            Next
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
