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
import { useStore } from '@/store/store'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Play,
  RefreshCcw,
  Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ShowResult from './ShowResult'

interface QuizComponentProps {
  lessonId: string
  onComplete: () => void
  course: Course
  setSelectedLesson: any
  setShowSummary: any
  setSelectedQuiz: any
  handleStartLearning: any
}

export function QuizComponent ({
  setSelectedLesson,
  lessonId,
  onComplete,
  handleStartLearning,
  setSelectedQuiz,
  setShowSummary,
  course
}: QuizComponentProps) {
  const lesson = course.lessons.find(lesson => lesson.id === lessonId)
  const quiz = lesson?.quizz

  const handleContinueLearning = () => {
    handleStartLearning()
  }

  const [showResults, setShowResults] = useState(quiz?.isCompleted || false)
  const [score, setScore] = useState(quiz?.gainedMarks || 0)
  const [timeSpent, setTimeSpent] = useState(quiz?.timeTaken || 0)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [hasStarted, setHasStarted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { updateQuizInCourse } = useStore()

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

  const instructions = [
    {
      icon: <RefreshCcw className='h-5 w-5 text-blue-500' />,
      text: 'Do not close or refresh the window during the quiz.'
    },
    {
      icon: <Ban className='h-5 w-5 text-red-500' />,
      text: 'You are not allowed to cheat during the quiz.'
    },
    {
      icon: <AlertCircle className='h-5 w-5 text-yellow-500' />,
      text: 'Closing the quiz will be considered as forfeiting.'
    },
    {
      icon: <CheckCircle2 className='h-5 w-5 text-green-500' />,
      text: 'Make sure to answer all questions before submitting.'
    }
  ]

  if (showResults) {
    return (
      <ShowResult
        score={score}
        quiz={quiz!}
        timeSpent={timeSpent}
        answers={answers}
        resetQuiz={() => {
          setShowResults(false)
          setAnswers({})
          setShowResults(false)
          setScore(0)
          setTimeSpent(0)
        }}
        handleContinueLearning={handleContinueLearning}
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
    setSubmitting(true)

    const timeTaken = startTime ? Math.floor(Date.now() - startTime) : 0

    setTimeSpent(timeTaken)

    try {
      const response = await axios.post('/api/complete-quiz', {
        quizId: quiz?.id,
        courseId: course?.id,
        timeTaken,
        answers
      })

      const updatedQuiz = response.data.quiz
      updateQuizInCourse(course?.id!, updatedQuiz)
      setShowResults(true)
      onComplete()
    } catch (error) {
      console.error(error)
      // Optional: show error toast here
    } finally {
      setSubmitting(false)
    }
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
        handleContinueLearning={handleContinueLearning}
        score={score}
        quiz={quiz!}
        timeSpent={timeSpent}
        answers={answers}
        resetQuiz={resetQuiz}
        onComplete={onComplete}
      />
    )
  }

  if (submitting) {
    return (
      <motion.div
        className='flex flex-col items-center justify-center h-96 text-center space-y-4'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className='rounded-full bg-primary/10 p-4'
        >
          <Loader2 className='h-10 w-10 text-primary animate-spin' />
        </motion.div>

        {/* Title */}
        <motion.div
          className='text-3xl font-extrabold text-primary'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Submitting your quiz...
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className='text-muted-foreground text-base max-w-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className='inline-flex items-center gap-1'>
            <FileText className='h-4 w-4' /> Processing your answers
          </span>{' '}
          <Sparkles className='h-4 w-4 inline-block text-yellow-400 animate-ping ml-1' />
        </motion.p>
      </motion.div>
    )
  }

  const currentQ = quiz?.questions.find(q => q.number === currentQuestion)
  const progress =
    ((currentQuestion - 1) / (quiz?.questions?.length || 1)) * 100

  if (!hasStarted) {
    return countdown !== null ? (
      <div className='flex items-center justify-center min-h-[60vh] text-6xl font-bold animate-pulse'>
        {countdown === 0 ? 'GO!' : countdown}
      </div>
    ) : (
      <div className='min-h-screen flex items-center justify-center px-2 bg-background'>
        <motion.div
          className='w-full max-w-sm bg-card border rounded-2xl shadow-lg p-6 space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className='text-2xl md:text-3xl font-bold text-primary flex items-center gap-2'>
            <span role='img' aria-label='book'>
              📘
            </span>{' '}
            Quiz Instructions
          </h2>

          <ul className='space-y-4 text-base'>
            {instructions.map((item, index) => (
              <motion.li
                key={index}
                className='flex items-start gap-3 text-muted-foreground'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={startQuiz}
              size='lg'
              className='gap-2 text-lg px-6 py-3 w-full'
            >
              <Play className='h-5 w-5' />
              Start Quiz
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-1 bg-background'>
      <div className='w-full'>
        <div className='mb-6 px-2'>
          <h2 className='text-2xl font-bold break-words'>{quiz?.title}</h2>
          <div className='flex items-center justify-between mt-1'>
            <p className='text-muted-foreground text-sm'>
              Question {currentQuestion} of {quiz?.questions?.length}
            </p>
            <Badge variant='secondary'>{currentQ?.marks} marks</Badge>
          </div>
          <Progress value={progress} className='h-2 mt-4' />
        </div>

        <Card className='mb-6 w-full rounded-lg border px-2'>
          <CardHeader className='pt-3 pb-1 px-0'>
            <CardTitle className='text-lg no-select break-words'>
              {currentQ?.question}
            </CardTitle>
            {currentQ?.type === 'DESCRIPTIVE' && currentQ.rubric && (
              <CardDescription>
                <div className='mt-2'>
                  <p className='font-medium no-select'>Marking Rubric:</p>
                  <ul className='list-disc list-inside no-select text-sm mt-1'>
                    {currentQ.rubric.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className='pb-3 pt-1 px-0'>
            {currentQ?.type === 'MCQ' && (
              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={value =>
                  handleAnswerChange(currentQ.id, Number(value))
                }
                className='space-y-3'
              >
                {currentQ.options.map((option: string, index: number) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value={index.toString()}
                      id={`q${currentQ.id}-${index}`}
                    />
                    <Label
                      htmlFor={`q${currentQ.id}-${index}`}
                      className='flex-1 cursor-pointer no-select'
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
                className='space-y-3'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='true' id={`q${currentQ.id}-true`} />
                  <Label
                    htmlFor={`q${currentQ.id}-true`}
                    className='cursor-pointer no-select'
                  >
                    True
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='false' id={`q${currentQ.id}-false`} />
                  <Label
                    htmlFor={`q${currentQ.id}-false`}
                    className='cursor-pointer no-select'
                  >
                    False
                  </Label>
                </div>
              </RadioGroup>
            )}

            {currentQ?.type === 'MULTIPLE_SELECT' && (
              <div className='space-y-3'>
                <p className='text-sm text-muted-foreground no-select'>
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
                      className='flex-1 cursor-pointer no-select'
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
                  onChange={e =>
                    handleAnswerChange(currentQ.id, e.target.value)
                  }
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

        <div className='flex justify-between gap-2 px-2'>
          <Button
            variant='outline'
            onClick={prevQuestion}
            disabled={currentQuestion === 1}
            className='w-1/2'
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>

          {currentQuestion === quiz?.questions?.length ? (
            <Button
              onClick={handleSubmit}
              disabled={!answers.hasOwnProperty(currentQ?.id || '')}
              className='w-1/2'
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!answers.hasOwnProperty(currentQ?.id || '')}
              className='w-1/2'
            >
              Next
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
