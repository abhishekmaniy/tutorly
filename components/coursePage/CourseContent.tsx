import { Course, Lesson, Quiz } from '@/lib/types'
import {
  ArrowRight,
  Award,
  BarChart as BarchartGraph,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  Trophy
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { QuizComponent } from './quiz-component'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/github-dark.css'
import CourseComplete from './CourseComplete'
import CourseSummary from './CourseSummary'
import CourseKeyPoint from './CourseKeyPoint'
import CourseAnalytics from './CourseAnalytics'
import { useEffect, useRef } from 'react'

const CourseContent = ({
  course,
  setShowAnalytics,
  selectedLesson,
  completedQuizzes,
  courseCompleted,
  setCompletedLessons,
  completedLessons,
  analyticsData,
  setSelectedLesson,
  setSelectedQuiz,
  selectedQuiz,
  handleQuizComplete,
  showKeyPoints,
  showAnalytics,
  showSummary,
  handleLessonComplete
}: {
  course: Course
  handleLessonComplete: any
  renderLessonContent: any
  setShowAnalytics: any
  selectedLesson: Lesson | null
  completedQuizzes: string[]
  courseCompleted: boolean
  setCompletedLessons: any
  completedLessons: string[]
  analyticsData: any
  setSelectedLesson: any
  setSelectedQuiz: any
  selectedQuiz: string | null
  handleQuizComplete: any
  showKeyPoints: boolean
  showAnalytics: boolean
  showSummary: boolean
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  console.log(completedLessons)

  useEffect(() => {
    const container = scrollContainerRef.current
    console.log('Scroll container:', container)

    if (!container) return

    const handleScroll = () => {
      console.log('Scroll fired')
      const { scrollTop, scrollHeight, clientHeight } = container
      console.log({ scrollTop, scrollHeight, clientHeight })

      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        selectedLesson &&
        !completedLessons.includes(selectedLesson.id)
      ) {
        handleLessonComplete(selectedLesson.id)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [selectedLesson, completedLessons])

  return (
    <div className='lg:col-span-3'>
      <Card className='h-full flex flex-col'>
        <div ref={scrollContainerRef} className='p-8 flex-1 overflow-y-auto'>
          <CardContent className='p-8 flex-1 overflow-y-auto '>
            {selectedLesson?.order! >= 0 && (
              <div className='prose prose-slate dark:prose-invert max-w-none'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h1 className='text-3xl font-bold mb-2'>
                      {selectedLesson?.title}
                    </h1>
                    <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                      <Badge variant='secondary'>
                        Lesson {selectedLesson?.order! + 1}
                      </Badge>
                      <span className='flex items-center'>
                        <Clock className='mr-1 h-4 w-4' />
                        {
                          course.lessons.find(l => l.id === selectedLesson?.id)
                            ?.duration
                        }
                      </span>
                    </div>
                  </div>
                  {completedLessons.includes(selectedLesson?.id!) && (
                    <Badge variant='default' className='bg-green-500'>
                      <CheckCircle className='mr-1 h-4 w-4' />
                      Completed
                    </Badge>
                  )}
                </div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                >
                  {selectedLesson?.content}
                </ReactMarkdown>
                <div className='flex justify-between mt-8 pt-6 border-t'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      if (selectedLesson?.order! > 1) {
                        setSelectedLesson(selectedLesson?.order! - 1)
                      }
                    }}
                    disabled={selectedLesson?.order === 1}
                  >
                    <ChevronLeft className='mr-2 h-4 w-4' />
                    Previous Lesson
                  </Button>

                  <Button
                    onClick={() => {
                      if (selectedLesson?.order! < course.lessons.length) {
                        setSelectedLesson(selectedLesson?.order! + 1)
                      }
                    }}
                    disabled={selectedLesson?.order === course.lessons.length}
                  >
                    Next Lesson
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {selectedQuiz && (
              <QuizComponent
                course={course}
                lessonId={selectedQuiz}
                onComplete={() => handleQuizComplete(selectedQuiz)}
              />
            )}

            {showSummary && <CourseSummary course={course} />}

            {showKeyPoints && <CourseKeyPoint course={course} />}

            {showAnalytics && (
              <CourseAnalytics
                analyticsData={analyticsData}
                completedLessons={completedLessons}
                completedQuizzes={completedQuizzes}
                course={course}
              />
            )}

            {courseCompleted && (
              <CourseComplete
                analyticsData={analyticsData}
                setShowAnalytics={setShowAnalytics}
              />
            )}

            {!selectedLesson &&
              !selectedQuiz &&
              !showSummary &&
              !showKeyPoints &&
              !showAnalytics &&
              !courseCompleted && (
                <div className='text-center py-12'>
                  <BookOpen className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                  <h2 className='text-2xl font-bold mb-2'>
                    Welcome to your course!
                  </h2>
                  <p className='text-muted-foreground mb-6'>
                    Select a lesson from the sidebar to get started with your
                    learning journey.
                  </p>
                  <Button onClick={() => setSelectedLesson(1)}>
                    Start First Lesson
                  </Button>
                </div>
              )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default CourseContent
