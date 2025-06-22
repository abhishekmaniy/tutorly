'use client'

import { ThemeToggle } from '@/components/common/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Analytics, KeyPoint, Lesson, Quiz, Summary } from '@/lib/types'
import { useStore } from '@/store/store'
import { useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { motion, Variants } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Clock,
  History,
  Loader2,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { ExpandableLessonCard } from './ExpandableLessonCard'
import { ExpandableQuizCard } from './ExpandableQuizCard'
import { ExpandableSummaryCard } from './ExpandableSummary'
import { ExpandableKeyPointCard } from './ExpandableKeypointCard'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  })
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function PromptPage () {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamMessages, setStreamMessages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<{
    syllabus?: any
    lessons: Lesson[]
    quizzes: Quiz[]
    summary?: Summary
    keyPoints?: KeyPoint[]
    analytics?: Analytics
    currentStep?: string
  }>({
    lessons: [],
    quizzes: []
  })

  console.log('generationProgress', generationProgress)

  const router = useRouter()
  const { getToken, userId } = useAuth()
  const { courses, setUser } = useStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchUserCourses = async () => {
      if (!userId) return
      try {
        setIsLoading(true)
        const token = await getToken()
        const res = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        setUser(res.data)
      } catch (err) {
        if (!axios.isCancel(err)) console.error('Fetch courses error', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCourses()
    return () => controller.abort()
  }, [userId])

  const handleGenerateCourse = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setStreamMessages([])
    setGenerationProgress({
      lessons: [],
      quizzes: []
    })

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController() // for cleanup purposes

    let socket: WebSocket | null = null
    let courseId: string | null = null

    try {
      const token = await getToken()
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}`

      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        socket?.send(
          JSON.stringify({
            topic: prompt,
            userId, // 👈 include userId for backend
            token
          })
        )
      }

      socket.onmessage = event => {
        try {
          const parsed = JSON.parse(event.data)

          if (parsed.step === 'syllabus' && parsed.status === 'completed') {
            setGenerationProgress(prev => ({
              ...prev,
              syllabus: parsed.data,
              currentStep: 'syllabus'
            }))
          }

          if (parsed.step === 'lesson' && parsed.data) {
            setGenerationProgress(prev => ({
              ...prev,
              lessons: [...prev.lessons, parsed.data],
              currentStep: 'lesson'
            }))
          }

          if (parsed.step === 'quiz' && parsed.data) {
            setGenerationProgress(prev => ({
              ...prev,
              quizzes: [...prev.quizzes, parsed.data],
              currentStep: 'quiz'
            }))
          }

          if (parsed.step === 'summary' && parsed.data) {
            setGenerationProgress(prev => ({
              ...prev,
              summary: parsed.data,
              currentStep: 'summary'
            }))
          }

          if (parsed.step === 'keyPoints' && parsed.data) {
            setGenerationProgress(prev => ({
              ...prev,
              keyPoints: parsed.data,
              currentStep: 'keyPoints'
            }))
          }

          if (parsed.step === 'analytics' && parsed.data) {
            setGenerationProgress(prev => ({
              ...prev,
              analytics: parsed.data,
              currentStep: 'analytics'
            }))
          }

          if (parsed.step === 'contentBlock') {
            setGenerationProgress(prev => ({
              ...prev,
              lessons: prev.lessons.map(lesson =>
                lesson.title === parsed.lessonTitle
                  ? {
                      ...lesson,
                      contentBlocks: [
                        ...(lesson.contentBlocks || []),
                        parsed.contentBlock
                      ]
                    }
                  : lesson
              ),
              currentStep: 'contentBlock'
            }))
          }

          if (parsed.step === 'completed' && parsed.courseId) {
            courseId = parsed.courseId
            router.push(`/course/${courseId}`)
          }

          if (parsed.step === 'error' && parsed.message) {
            setError(parsed.message)
          }

          if (typeof parsed === 'string') {
            setStreamMessages(prev => [...prev, parsed])
          }
        } catch (err) {
          console.error('Error parsing message', err)
        }
      }

      socket.onerror = () => {
        setError('WebSocket error during course generation')
      }

      socket.onclose = () => {
        setIsGenerating(false)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to start WebSocket course generation.')
      setIsGenerating(false)
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }

  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  if (!isMounted) return null

  console.log(streamMessages)

  return (
    <div className='h-screen overflow-hidden bg-background'>
      {/* Top Navigation */}
      <nav className='sticky top-0 z-50 bg-background/80 backdrop-blur border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link href='/' className='flex items-center gap-2'>
              <BookOpen className='h-6 w-6 text-primary' />
              <span className='text-xl font-semibold tracking-tight'>
                Tutorly
              </span>
            </Link>

            <div className='flex items-center gap-2'>
              <Link href='/history'>
                <Button variant='outline' size='sm'>
                  <History className='mr-2 h-4 w-4' />
                  All Courses
                </Button>
              </Link>
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-4'>
          {/* Sidebar - Recent Courses */}
          <aside className='lg:col-span-1 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r p-4 scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#0f0f0f]'>
            {isLoading ? (
              <motion.div
                className='lg:col-span-1 p-4'
                variants={cardVariants}
                initial='hidden'
                animate='visible'
              >
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Clock className='mr-2 h-5 w-5 text-primary' />
                  Recent Courses
                </h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  Continue where you left off
                </p>
                <Card className='sticky top-6 p-4 space-y-5'>
                  <Skeleton className='h-6 w-1/2' /> {/* Title */}
                  <Skeleton className='h-4 w-full' /> {/* Description */}
                  <div className='space-y-2 mt-4'>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className='h-14 w-full rounded-lg' />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className='bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-none border-none'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Clock className='mr-2 h-5 w-5 text-primary' />
                  Recent Courses
                </h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  Continue where you left off
                </p>

                <div className='space-y-3'>
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <Link key={course.id} href={`/course/${course.id}`}>
                        <Card className='cursor-pointer p-3 hover:bg-muted transition rounded-lg'>
                          <div className='flex justify-between items-center mb-1'>
                            <h4 className='font-medium text-base'>
                              {course.title}
                            </h4>
                            <span className='text-xs text-muted-foreground'>
                              {course.progress}%
                            </span>
                          </div>
                          <p className='text-xs text-muted-foreground mb-2'>
                            {course.lessons.length} lessons
                          </p>
                          <div className='w-full bg-muted rounded-full h-2'>
                            <div
                              className='bg-primary h-2 rounded-full transition-all'
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <Card>
                      <CardContent className='text-gray-500 justify-center items-center '>
                        No Course Generated Yet!
                      </CardContent>
                    </Card>
                  )}
                </div>
              </Card>
            )}
          </aside>

          {/* Main Content - Course Generation */}
          {isGenerating ? (
            <div className='fixed inset-x-0 top-16 z-40 h-[calc(100vh-64px)] flex flex-col items-center justify-start bg-background/80 backdrop-blur-sm overflow-y-auto scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#0f0f0f]'>
              {/* Animated Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='mt-6 mb-4 text-primary'
              >
                <Sparkles size={48} />
              </motion.div>

              {/* Animated Title */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='text-2xl font-semibold mb-2'
              >
                Generating Your Course
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='text-muted-foreground mb-6'
              >
                Please wait while we create your personalized course...
              </motion.p>

              {/* Animated Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='w-full max-w-lg space-y-4 px-4'
              >
                {generationProgress.syllabus && (
                  <Card className='mb-4'>
                    <CardHeader className='text-primary'>
                      <BookOpen size={20} className='mb-2' />
                      <CardTitle className='text-xl'>
                        {generationProgress.syllabus.title}
                      </CardTitle>
                      <CardDescription className='text-muted-foreground'>
                        {generationProgress.syllabus.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {generationProgress.lessons.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lessons</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#0f0f0f]'>
                      <ExpandableLessonCard
                        lessons={generationProgress.lessons}
                      />
                    </CardContent>
                  </Card>
                )}

                {generationProgress.quizzes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#0f0f0f]'>
                      <ExpandableQuizCard quizes={generationProgress.quizzes} />
                    </CardContent>
                  </Card>
                )}

                {generationProgress.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-y-auto max-h-[400px] pr-2'>
                      <ExpandableSummaryCard
                        summary={generationProgress.summary}
                      />
                    </CardContent>
                  </Card>
                )}

                {generationProgress.keyPoints && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-y-auto max-h-[400px] pr-2'>
                      <ExpandableKeyPointCard
                        keyPoints={generationProgress.keyPoints}
                      />
                    </CardContent>
                  </Card>
                )}

                {generationProgress.analytics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-y-auto max-h-[400px] pr-2'>
                      Generating Analytics...
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              {/* Loading Spinner */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className='mt-6 text-primary'
              >
                <Loader2 size={32} />
              </motion.div>
            </div>
          ) : (
            <motion.div
              className='lg:col-span-3'
              initial='hidden'
              animate='visible'
              variants={{
                hidden: {},
                visible: {}
              }}
            >
              <div className='max-w-2xl mx-auto'>
                {/* Title & Description */}
                <motion.div
                  className='text-center mb-8'
                  variants={fadeUp}
                  custom={0.1}
                >
                  <Badge variant='secondary' className='mb-4'>
                    <Sparkles className='mr-2 h-4 w-4' />
                    AI Course Generator
                  </Badge>
                  <motion.h1
                    className='text-4xl font-bold mb-4'
                    variants={fadeUp}
                    custom={0.2}
                  >
                    What would you like to learn today?
                  </motion.h1>
                  <motion.p
                    className='text-lg text-muted-foreground'
                    variants={fadeUp}
                    custom={0.3}
                  >
                    Describe any topic and our AI will create a comprehensive
                    course with lessons, quizzes, and progress tracking.
                  </motion.p>
                </motion.div>

                {/* Card */}
                <motion.div variants={fadeUp} custom={0.4}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Generate Your Course</CardTitle>
                      <CardDescription>
                        Be specific about what you want to learn for the best
                        results
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <motion.div variants={fadeUp} custom={0.5}>
                        <Textarea
                          ref={textareaRef}
                          placeholder='Example: I want to learn React.js from basics to advanced, including hooks, state management, and building real projects...'
                          value={prompt}
                          onChange={e => setPrompt(e.target.value)}
                          className='min-h-[120px] resize-none'
                        />
                      </motion.div>

                      <motion.div
                        className='flex flex-col sm:flex-row gap-4'
                        variants={fadeUp}
                        custom={0.6}
                      >
                        <Button
                          onClick={handleGenerateCourse}
                          disabled={isGenerating || !prompt.trim()}
                          className='flex-1'
                          size='lg'
                        >
                          {isGenerating ? (
                            <>
                              <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
                              Generating Course...
                            </>
                          ) : (
                            <>
                              Generate Course
                              <ArrowRight className='ml-2 h-4 w-4' />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Example Prompts */}
                      <motion.div
                        className='space-y-3'
                        variants={fadeUp}
                        custom={0.7}
                      >
                        <p className='text-sm font-medium'>
                          Try these examples:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {[
                            'Learn Python programming from scratch',
                            'Digital marketing strategies for beginners',
                            'Introduction to machine learning',
                            'Web development with HTML, CSS, and JavaScript'
                          ].map((example, index) => (
                            <motion.div
                              key={index}
                              variants={fadeUp}
                              custom={0.8 + index * 0.05}
                            >
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  setPrompt(example)
                                  setTimeout(
                                    () => textareaRef.current?.focus(),
                                    0
                                  )
                                }}
                                className='text-xs'
                              >
                                {example}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      </div>
    </div>
  )
}
