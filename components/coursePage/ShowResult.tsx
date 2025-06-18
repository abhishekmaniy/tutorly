import { Award, CheckCircle, XCircle } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Quiz } from '@/lib/types'

const ShowResult = ({
  score,
  quiz,
  timeSpent,
  answers,
  resetQuiz,
  onComplete
}: {
  score: number
  quiz: Quiz
  timeSpent: number
  answers: Record<string, any>
  resetQuiz:any
  onComplete:any
}) => {
  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90)
      return { grade: 'Outstanding', color: 'text-green-600' }
    if (percentage >= 80) return { grade: 'Excellent', color: 'text-blue-600' }
    if (percentage >= 70) return { grade: 'Good', color: 'text-yellow-600' }
    if (percentage >= 60) return { grade: 'Average', color: 'text-orange-600' }
    return { grade: 'Needs Improvement', color: 'text-red-600' }
  }

  const gradeInfo = getGrade(score, quiz?.totalMarks!)
  const percentage = Math.round((score / quiz?.totalMarks!) * 100)

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <Award className='mx-auto mb-4 h-16 w-16 text-primary' />
        <h2 className='text-3xl font-bold mb-2'>Quiz Results</h2>
        <p className='text-muted-foreground'>Here's how you performed</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Score</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center'>
            <div className='text-4xl font-bold mb-2'>
              {score}/{quiz?.totalMarks!}
            </div>
            <div className='text-2xl mb-2'>
              <span className={gradeInfo.color}>{gradeInfo.grade}</span>
            </div>
            <Progress value={percentage} className='h-3' />
            <p className='text-sm text-muted-foreground mt-2'>{percentage}%</p>
          </div>

          <div className='grid grid-cols-2 gap-4 text-center'>
            <div>
              <p className='text-sm text-muted-foreground'>Time Taken</p>
              <p className='text-lg font-semibold'>{timeSpent} min</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <Badge
                variant={score >= quiz.passingMarks ? 'default' : 'destructive'}
              >
                {score >= quiz.passingMarks ? 'Passed' : 'Failed'}
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
          <div className='space-y-4'>
            {quiz?.questions.map((question, index) => {
              const answer = answers[question.id]
              let isCorrect = false

              switch (question.type) {
                case 'MCQ': {
                  // answer is index → map to option text
                  const selectedOption =
                    typeof answer === 'number' ? question.options[answer] : ''
                  isCorrect =
                    selectedOption?.toLowerCase() ===
                    question.correctAnswers?.[0]?.toLowerCase()
                  break
                }

                case 'TRUE_FALSE': {
                  // answer is boolean
                  isCorrect =
                    answer.toString().toUpperCase() ===
                    question.correctAnswers?.[0]
                  break
                }

                case 'MULTIPLE_SELECT': {
                  if (
                    Array.isArray(answer) &&
                    Array.isArray(question.correctAnswers)
                  ) {
                    const selectedOptions = answer.map(
                      index => question.options[index]
                    )
                    const sortedUser = [...selectedOptions].sort()
                    const sortedCorrect = [...question.correctAnswers].sort()
                    isCorrect =
                      JSON.stringify(sortedUser) ===
                      JSON.stringify(sortedCorrect)
                  }
                  break
                }

                case 'DESCRIPTIVE': {
                  isCorrect =
                    typeof answer === 'string' && answer.trim().length > 50
                  break
                }
              }

              return (
                <div
                  key={question.id}
                  className='flex items-center justify-between p-3 border rounded'
                >
                  <div className='flex items-center space-x-3'>
                    {isCorrect ? (
                      <CheckCircle className='h-5 w-5 text-green-500' />
                    ) : (
                      <XCircle className='h-5 w-5 text-red-500' />
                    )}
                    <span className='font-medium'>Question {index + 1}</span>
                  </div>
                  <div className='text-right'>
                    <span className='text-sm text-muted-foreground'>
                      {question.marks} marks
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-center space-x-4'>
        <Button onClick={resetQuiz} variant='outline'>
          Retake Quiz
        </Button>
        <Button onClick={onComplete}>Continue Learning</Button>
      </div>
    </div>
  )
}

export default ShowResult
