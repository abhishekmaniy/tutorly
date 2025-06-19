import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import { Progress } from '../ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { Button } from '../ui/button'
import {
  BarChart,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Target,
  Trophy
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { Course, Lesson, Quiz } from '@/lib/types'
import { Skeleton } from '../ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

interface SidebarProps {
  course?: Course
  progress: number
  lessonsOpen: boolean
  selectedLesson: Lesson | null
  quizzesOpen: boolean
  completedLessons: string[]
  completedQuizzes: string[]
  courseCompleted: boolean
  showSummary: boolean
  showKeyPoints: boolean
  showAnalytics: boolean
  selectedQuiz: string | null
  setLessonsOpen: (open: boolean) => void
  setSelectedLesson: any
  setSelectedQuiz: any
  setShowSummary: (show: boolean) => void
  setShowKeyPoints: (show: boolean) => void
  setShowAnalytics: (show: boolean) => void
  setQuizzesOpen: (open: boolean) => void
  setCourseCompleted: (completed: boolean) => void
  checkCourseCompletion: () => boolean
}

const Sidebar = ({
  course,
  progress,
  lessonsOpen,
  selectedLesson,
  quizzesOpen,
  completedLessons,
  completedQuizzes,
  courseCompleted,
  showSummary,
  showKeyPoints,
  showAnalytics,
  selectedQuiz,
  setLessonsOpen,
  setSelectedLesson,
  setSelectedQuiz,
  setShowSummary,
  setShowKeyPoints,
  setShowAnalytics,
  setQuizzesOpen,
  setCourseCompleted,
  checkCourseCompletion
}: SidebarProps) => {
  if (!course) {
    return (
      <motion.div
        className='lg:col-span-1 p-4'
        variants={cardVariants}
        initial='hidden'
        animate='visible'
      >
        <Card className='sticky top-6 p-4 space-y-5'>
          <Skeleton className='h-6 w-1/2' /> {/* Title */}
          <Skeleton className='h-4 w-full' /> {/* Description */}
          <Skeleton className='h-2 w-full' /> {/* Progress Label */}
          <Skeleton className='h-2 w-full rounded bg-muted-foreground/20' />{' '}
          {/* Progress Bar */}
          <div className='space-y-2 mt-4'>
            <Skeleton className='h-10 w-full rounded-lg' /> {/* Lessons */}
            <Skeleton className='h-10 w-full rounded-lg' /> {/* Quizzes */}
            <Skeleton className='h-10 w-full rounded-lg' /> {/* Summary */}
            <Skeleton className='h-10 w-full rounded-lg' /> {/* Key Points */}
            <Skeleton className='h-10 w-full rounded-lg' /> {/* Analytics */}
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className='lg:col-span-1'>
      <Card className='sticky top-6'>
        <CardHeader>
          <CardTitle className='text-lg'>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <Progress value={progress} className='h-2' />
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Lessons Section */}
          <Collapsible open={lessonsOpen} onOpenChange={setLessonsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='w-full justify-between p-0 h-auto'
              >
                <span className='font-medium'>
                  Lessons ({course.lessons.length})
                </span>
                {lessonsOpen ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-2 mt-2'>
              <AnimatePresence>
                {course.lessons.map(lesson => (
                  <Button
                    key={lesson.id}
                    variant={
                      selectedLesson?.id === lesson.id ? 'secondary' : 'ghost'
                    }
                    className='w-full justify-start h-auto p-3'
                    onClick={() => {
                      setSelectedLesson(lesson)
                      setSelectedQuiz(null)
                      setShowSummary(false)
                      setShowKeyPoints(false)
                      setShowAnalytics(false)
                    }}
                  >
                    <div className='flex items-center space-x-3 w-full'>
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
                      ) : (
                        <Circle className='h-5 w-5 text-muted-foreground flex-shrink-0' />
                      )}
                      <div className='text-left flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                          {lesson.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Quizzes Section */}
          <Collapsible open={quizzesOpen} onOpenChange={setQuizzesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='w-full justify-between p-0 h-auto'
              >
                <span className='font-medium'>
                  Quizzes ({course.lessons.length})
                </span>
                {quizzesOpen ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-2 mt-2'>
              <AnimatePresence>
                {course.lessons.map(lesson => (
                  <Button
                    key={`quiz-${lesson.id}`}
                    variant={selectedQuiz === lesson.id ? 'secondary' : 'ghost'}
                    className='w-full justify-start h-auto p-3'
                    onClick={() => {
                      setSelectedQuiz(lesson.id)
                      setSelectedLesson(null)
                      setShowSummary(false)
                      setShowKeyPoints(false)
                      setShowAnalytics(false)
                    }}
                  >
                    <div className='flex items-center space-x-3 w-full'>
                      {completedQuizzes.includes(lesson?.quizz?.id!) ? (
                        <CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
                      ) : (
                        <Circle className='h-5 w-5 text-muted-foreground flex-shrink-0' />
                      )}
                      <div className='text-left flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                          Lesson {lesson.order} Quiz
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          5 questions
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant={showSummary ? 'secondary' : 'ghost'}
              className='w-full justify-start'
              onClick={() => {
                setShowSummary(true)
                setShowKeyPoints(false)
                setShowAnalytics(false)
                setSelectedLesson(null) // ✅ Fix here
                setSelectedQuiz(null)
              }}
            >
              <Target className='mr-3 h-5 w-5' />
              Course Summary
            </Button>
          </motion.div>

          {/* Key Points Section */}
          <motion.div>
            <Button
              variant={showKeyPoints ? 'secondary' : 'ghost'}
              className='w-full justify-start'
              onClick={() => {
                setShowKeyPoints(true)
                setShowSummary(false)
                setShowAnalytics(false)
                setSelectedLesson(null) // ✅ Fix here
                setSelectedQuiz(null)
              }}
            >
              <CheckCircle className='mr-3 h-5 w-5' />
              Key Points
            </Button>
          </motion.div>

          {/* Analytics Section */}
          <motion.div>
            <Button
              variant={showAnalytics ? 'secondary' : 'ghost'}
              className='w-full justify-start'
              onClick={() => {
                setShowAnalytics(true)
                setShowSummary(false)
                setShowKeyPoints(false)
                setSelectedLesson(null) // ✅ Fix here
                setSelectedQuiz(null)
              }}
            >
              <BarChart className='mr-3 h-5 w-5' />
              Analytics
            </Button>
          </motion.div>

          {/* Course Completion Section */}
          {checkCourseCompletion() && !courseCompleted && (
            <>
              <Separator />
              <Button
                className='w-full bg-green-600 hover:bg-green-700'
                onClick={() => setCourseCompleted(true)}
              >
                <Trophy className='mr-3 h-5 w-5' />
                Complete Course
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Sidebar
