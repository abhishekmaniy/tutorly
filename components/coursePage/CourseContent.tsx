import { Course, Lesson } from '@/lib/types'
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { QuizComponent } from './quiz-component'

import 'highlight.js/styles/github-dark.css'
import { ComponentPropsWithoutRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import CourseAnalytics from './CourseAnalytics'
import CourseComplete from './CourseComplete'
import CourseKeyPoint from './CourseKeyPoint'
import CourseSummary from './CourseSummary'
import rehypeMathjax from 'rehype-mathjax'
import { ComponentProps } from 'react'

import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeProps extends ComponentProps<'code'> {
  inline?: boolean
  className?: string
  children: React.ReactNode
}

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
  console.log(course.lessons)
  console.log(selectedLesson)

  return (
    <div className='lg:col-span-3'>
      <Card className='h-full flex flex-col'>
        <div className='p-8 flex-1 overflow-y-auto'>
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
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeMathjax]}
                  components={{
                    code: (({
                      inline,
                      className,
                      children,
                      ...props
                    }: CodeProps) => {
                      const match = /language-(\w+)/.exec(className || '')
                      if (inline || !match) {
                        return (
                          <code
                            className={className}
                            style={{
                              background: '#1e1e1e',
                              color: '#dcdcdc',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '0.3rem',
                              fontSize: '0.9rem'
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      }

                      return (
                        <div style={{ margin: '1rem 0' }}>
                          <SyntaxHighlighter
                            language={match[1]}
                            style={vscDarkPlus}
                            customStyle={{
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.9rem'
                            }}
                            showLineNumbers
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }) as any
                  }}
                >
                  {selectedLesson?.content}
                </ReactMarkdown>
                <div className='flex justify-between mt-8 pt-6 border-t'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      if (selectedLesson && selectedLesson.order > 0) {
                        const prevLesson = course.lessons.find(
                          l => l.order === selectedLesson.order - 1
                        )
                        console.log(prevLesson)
                        if (prevLesson) setSelectedLesson(prevLesson)
                      }
                    }}
                    disabled={selectedLesson?.order === 0}
                  >
                    <ChevronLeft className='mr-2 h-4 w-4' />
                    Previous Lesson
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedLesson(null)
                      setSelectedQuiz(selectedLesson?.id)
                    }}
                  >
                    Give Quiz
                  </Button>

                  <Button
                    onClick={() => {
                      if (
                        selectedLesson &&
                        selectedLesson.order < course.lessons.length
                      ) {
                        const nextLesson = course.lessons.find(
                          l => l.order === selectedLesson.order + 1
                        )
                        if (nextLesson) setSelectedLesson(nextLesson)
                      }
                    }}
                    disabled={
                      selectedLesson?.order! + 1 === course.lessons.length
                    }
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
                  <Button onClick={() => setSelectedLesson(course.lessons[0])}>
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
