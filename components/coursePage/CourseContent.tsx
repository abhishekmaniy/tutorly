import { Course, Lesson } from '@/lib/types'
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Rocket,
  Sparkles
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { QuizComponent } from './quiz-component'

import { motion } from 'framer-motion'
import 'highlight.js/styles/github-dark.css'
import { ComponentProps, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import rehypeMathjax from 'rehype-mathjax'
import CourseAnalytics from './CourseAnalytics'
import CourseComplete from './CourseComplete'
import CourseKeyPoint from './CourseKeyPoint'
import CourseSummary from './CourseSummary'

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
  setCourseCompleted,
  setCompletedLessons,
  completedLessons,
  setShowSummary,
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
  setShowSummary: any
  setCourseCompleted: any
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
  const [copied, setCopied] = useState(false)

  const handleStartLearning = () => {
    if (!course) return

    const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order)

    const nextLesson = sortedLessons.find(
      lesson => !completedLessons.includes(lesson.id)
    )

    if (nextLesson) {
      setSelectedLesson(nextLesson)
      setSelectedQuiz(null)
    } else {
      setShowSummary(true)
    }
  }

  return (
    <div className='lg:col-span-3'>
      <Card className='h-full flex flex-col'>
        <div className='p-8 flex-1 overflow-y-auto scrollbar-custom'>
          <CardContent className='p-8 flex-1 overflow-y-auto scrollbar-custom'>
            {selectedLesson?.order! >= 0 && (
              <div className='prose prose-slate dark:prose-invert max-w-none'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <motion.h1
                      className='text-3xl font-bold mb-2'
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {selectedLesson?.title}
                    </motion.h1>
                    <motion.div
                      className='flex items-center space-x-4 text-sm text-muted-foreground'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
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
                    </motion.div>
                  </div>
                  {completedLessons.includes(selectedLesson?.id!) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Badge variant='default' className='bg-green-500'>
                        <CheckCircle className='mr-1 h-4 w-4' />
                        Completed
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <div className='space-y-6'>
                  {selectedLesson?.contentBlocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => {
                      switch (block.type) {
                        case 'TEXT':
                        case 'MATH':
                          return (
                            <motion.div
                              key={block.id}
                              className='prose dark:prose-invert max-w-none'
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: block.order * 0.1
                              }}
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[
                                  rehypeRaw,
                                  rehypeSanitize,
                                  rehypeMathjax
                                ]}
                              >
                                {block.text || ''}
                              </ReactMarkdown>
                            </motion.div>
                          )

                        case 'CODE':
                          return (
                            <motion.div
                              key={block.id}
                              className='relative rounded-xl overflow-hidden text-sm'
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: block.order * 0.1
                              }}
                            >
                              {/* Copy Button */}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    block.code || ''
                                  )
                                  setCopied(true)
                                  setTimeout(() => setCopied(false), 2000)
                                }}
                                className='absolute top-2 right-2 z-10 rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary/80 transition'
                              >
                                {copied ? (
                                  <Check className='h-4 w-4' />
                                ) : (
                                  <Copy className='h-4 w-4' />
                                )}
                              </button>

                              <SyntaxHighlighter
                                language={'plaintext'}
                                style={vscDarkPlus}
                                showLineNumbers
                                wrapLongLines
                                customStyle={{
                                  background: '#1e1e1e',
                                  fontSize: '0.875rem',
                                  padding: '1rem',
                                  borderRadius: '0.75rem'
                                }}
                                lineNumberStyle={{ color: '#6a9955' }}
                              >
                                {block.code || ''}
                              </SyntaxHighlighter>
                            </motion.div>
                          )

                        case 'GRAPH':
                          if (
                            !block.graph?.data ||
                            !Array.isArray(block.graph.data)
                          )
                            return null
                          const xKey = block.graph.xKey || 'label'
                          const yKey = block.graph.yKey || 'value'

                          return (
                            <motion.div
                              key={block.id}
                              className='w-full h-64'
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: block.order * 0.1
                              }}
                            >
                              <ResponsiveContainer>
                                <LineChart data={block.graph.data}>
                                  <CartesianGrid strokeDasharray='3 3' />
                                  <XAxis dataKey={xKey} />
                                  <YAxis />
                                  <Tooltip />
                                  <Line
                                    type='monotone'
                                    dataKey={yKey}
                                    stroke='#6366f1' // Indigo-500 Tailwind color
                                    strokeWidth={2}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </motion.div>
                          )

                        default:
                          return (
                            <p key={block.id} className='text-muted-foreground'>
                              Unknown block type: {block.type}
                            </p>
                          )
                      }
                    })}
                </div>
                <div className='flex justify-between mt-8 pt-6 border-t'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      if (selectedLesson && selectedLesson.order > 0) {
                        const prevLesson = course.lessons.find(
                          l => l.order === selectedLesson.order - 1
                        )
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
                handleStartLearning={handleStartLearning}
                setSelectedLesson={setSelectedLesson}
                setSelectedQuiz={setSelectedQuiz}
                setShowSummary={setShowSummary}
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
                setCourseComplete={setCourseCompleted}
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
                <motion.div
                  className='text-center py-16 px-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'backOut' }}
                  >
                    <div className='relative inline-flex mb-6'>
                      <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-primary/5 blur-xl'></div>
                      <div className='relative p-4 rounded-full bg-primary/10'>
                        <Rocket className='h-12 w-12 text-primary' />
                      </div>
                    </div>
                  </motion.div>

                  <h2 className='text-3xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80'>
                    🚀 Welcome to Your Course!
                  </h2>

                  <p className='text-muted-foreground text-lg max-w-xl mx-auto mb-8'>
                    Select a lesson from the sidebar to begin your journey of
                    learning, growth, and discovery.
                  </p>

                  <Button
                    onClick={() => handleStartLearning()}
                    size='lg'
                    className='group'
                  >
                    Start First Lesson
                    <ChevronRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
                  </Button>

                  <div className='mt-6 text-sm text-muted-foreground flex justify-center gap-2'>
                    <Sparkles className='h-4 w-4 text-primary' />
                    <span>New skills unlocked with every lesson!</span>
                  </div>
                </motion.div>
              )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default CourseContent
