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
  GraduationCap,
  History,
  Loader2,
  Menu,
  Rocket,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { ExpandableLessonCard } from './ExpandableLessonCard'
import { ExpandableQuizCard } from './ExpandableQuizCard'
import { ExpandableSummaryCard } from './ExpandableSummary'
import { ExpandableKeyPointCard } from './ExpandableKeypointCard'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { Plan } from '@/lib/generated/prisma'
import toast from "react-hot-toast"


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

export function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeCommitment, setTimeCommitment] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [goal, setGoal] = useState('')
  const [learningStyle, setLearningStyle] = useState<
    'Text-based' | 'Visual Diagrams' | 'Project-focused' | ''
  >('')
  const [generationProgress, setGenerationProgress] = useState<{
    syllabus?: any
    lessons: Lesson[]
    quizzes: Quiz[]
    summary?: Summary
    keyPoints?: KeyPoint[]
    analytics?: Analytics
    currentStep?: string
  }>({
    syllabus: {
      title: 'Introduction to Web Development',
      description: 'A beginner-friendly course to learn modern web development.'
    },
    lessons: [
      {
        id: 'lesson1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML structure and elements.',
        order: 1,
        duration: '30m',
        isCompleted: false,
        completedAt: null,
        courseId: 'dummyCourseId',
        timeTaken: 0,
        contentBlocks: [
          {
            id: 'cb1',
            lessonId: 'lesson1',
            order: 1,
            type: 'TEXT',
            text: 'HTML stands for HyperText Markup Language.',
            code: null,
            math: null,
            graph: null
          },
          {
            id: 'cb2',
            lessonId: 'lesson1',
            order: 2,
            type: 'CODE',
            text: null,
            code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>',
            math: null,
            graph: null
          }
        ],
        quizz: {
          id: 'quiz1',
          title: 'Getting Started with HTML Quiz',
          lessonId: 'lesson1',
          duration: '10m',
          totalMarks: 10,
          passingMarks: 6,
          gainedMarks: 0,
          timeTaken: 0,
          status: 'PASS',
          completedAt: null,
          isCompleted: false,
          questions: [
            {
              id: 'q1',
              quizId: 'quiz1',
              number: 1,
              question: 'What does HTML stand for?',
              type: 'MULTIPLE_SELECT',
              options: [
                'HyperText Markup Language',
                'Home Tool Markup Language',
                'Hyperlinks and Text Markup Language'
              ],
              marks: 2,
              isCorrect: false,
              correctAnswers: ['HyperText Markup Language'],
              explanation: 'HTML stands for HyperText Markup Language.',
              rubric: []
            }
          ]
        }
      },
      {
        id: 'lesson1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML structure and elements.',
        order: 1,
        duration: '30m',
        isCompleted: false,
        completedAt: null,
        courseId: 'dummyCourseId',
        timeTaken: 0,
        contentBlocks: [
          {
            id: 'cb1',
            lessonId: 'lesson1',
            order: 1,
            type: 'TEXT',
            text: 'HTML stands for HyperText Markup Language.',
            code: null,
            math: null,
            graph: null
          },
          {
            id: 'cb2',
            lessonId: 'lesson1',
            order: 2,
            type: 'CODE',
            text: null,
            code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>',
            math: null,
            graph: null
          }
        ],
        quizz: {
          id: 'quiz1',
          title: 'Getting Started with HTML Quiz',
          lessonId: 'lesson1',
          duration: '10m',
          totalMarks: 10,
          passingMarks: 6,
          gainedMarks: 0,
          timeTaken: 0,
          status: 'PASS',
          completedAt: null,
          isCompleted: false,
          questions: [
            {
              id: 'q1',
              quizId: 'quiz1',
              number: 1,
              question: 'What does HTML stand for?',
              type: 'MULTIPLE_SELECT',
              options: [
                'HyperText Markup Language',
                'Home Tool Markup Language',
                'Hyperlinks and Text Markup Language'
              ],
              marks: 2,
              isCorrect: false,
              correctAnswers: ['HyperText Markup Language'],
              explanation: 'HTML stands for HyperText Markup Language.',
              rubric: []
            }
          ]
        }
      },
      {
        id: 'lesson1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML structure and elements.',
        order: 1,
        duration: '30m',
        isCompleted: false,
        completedAt: null,
        courseId: 'dummyCourseId',
        timeTaken: 0,
        contentBlocks: [
          {
            id: 'cb1',
            lessonId: 'lesson1',
            order: 1,
            type: 'TEXT',
            text: 'HTML stands for HyperText Markup Language.',
            code: null,
            math: null,
            graph: null
          },
          {
            id: 'cb2',
            lessonId: 'lesson1',
            order: 2,
            type: 'CODE',
            text: null,
            code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>',
            math: null,
            graph: null
          }
        ],
        quizz: {
          id: 'quiz1',
          title: 'Getting Started with HTML Quiz',
          lessonId: 'lesson1',
          duration: '10m',
          totalMarks: 10,
          passingMarks: 6,
          gainedMarks: 0,
          timeTaken: 0,
          status: 'PASS',
          completedAt: null,
          isCompleted: false,
          questions: [
            {
              id: 'q1',
              quizId: 'quiz1',
              number: 1,
              question: 'What does HTML stand for?',
              type: 'MULTIPLE_SELECT',
              options: [
                'HyperText Markup Language',
                'Home Tool Markup Language',
                'Hyperlinks and Text Markup Language'
              ],
              marks: 2,
              isCorrect: false,
              correctAnswers: ['HyperText Markup Language'],
              explanation: 'HTML stands for HyperText Markup Language.',
              rubric: []
            }
          ]
        }
      },
      {
        id: 'lesson1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML structure and elements.',
        order: 1,
        duration: '30m',
        isCompleted: false,
        completedAt: null,
        courseId: 'dummyCourseId',
        timeTaken: 0,
        contentBlocks: [
          {
            id: 'cb1',
            lessonId: 'lesson1',
            order: 1,
            type: 'TEXT',
            text: 'HTML stands for HyperText Markup Language.',
            code: null,
            math: null,
            graph: null
          },
          {
            id: 'cb2',
            lessonId: 'lesson1',
            order: 2,
            type: 'CODE',
            text: null,
            code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>',
            math: null,
            graph: null
          }
        ],
        quizz: {
          id: 'quiz1',
          title: 'Getting Started with HTML Quiz',
          lessonId: 'lesson1',
          duration: '10m',
          totalMarks: 10,
          passingMarks: 6,
          gainedMarks: 0,
          timeTaken: 0,
          status: 'PASS',
          completedAt: null,
          isCompleted: false,
          questions: [
            {
              id: 'q1',
              quizId: 'quiz1',
              number: 1,
              question: 'What does HTML stand for?',
              type: 'MULTIPLE_SELECT',
              options: [
                'HyperText Markup Language',
                'Home Tool Markup Language',
                'Hyperlinks and Text Markup Language'
              ],
              marks: 2,
              isCorrect: false,
              correctAnswers: ['HyperText Markup Language'],
              explanation: 'HTML stands for HyperText Markup Language.',
              rubric: []
            }
          ]
        }
      },
      {
        id: 'lesson1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML structure and elements.',
        order: 1,
        duration: '30m',
        isCompleted: false,
        completedAt: null,
        courseId: 'dummyCourseId',
        timeTaken: 0,
        contentBlocks: [
          {
            id: 'cb1',
            lessonId: 'lesson1',
            order: 1,
            type: 'TEXT',
            text: 'HTML stands for HyperText Markup Language.',
            code: null,
            math: null,
            graph: null
          },
          {
            id: 'cb2',
            lessonId: 'lesson1',
            order: 2,
            type: 'CODE',
            text: null,
            code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>',
            math: null,
            graph: null
          }
        ],
        quizz: {
          id: 'quiz1',
          title: 'Getting Started with HTML Quiz',
          lessonId: 'lesson1',
          duration: '10m',
          totalMarks: 10,
          passingMarks: 6,
          gainedMarks: 0,
          timeTaken: 0,
          status: 'PASS',
          completedAt: null,
          isCompleted: false,
          questions: [
            {
              id: 'q1',
              quizId: 'quiz1',
              number: 1,
              question: 'What does HTML stand for?',
              type: 'MULTIPLE_SELECT',
              options: [
                'HyperText Markup Language',
                'Home Tool Markup Language',
                'Hyperlinks and Text Markup Language'
              ],
              marks: 2,
              isCorrect: false,
              correctAnswers: ['HyperText Markup Language'],
              explanation: 'HTML stands for HyperText Markup Language.',
              rubric: []
            }
          ]
        }
      }
    ],
    quizzes: []
  })

  const [showPersonalization, setShowPersonalization] = useState(false)
  const [level, setLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced' | ''
  >('')
  const [preferredTopics, setPreferredTopics] = useState('')
  const [dislikedTopics, setDislikedTopics] = useState('')

  console.log('generationProgress', generationProgress)

  const router = useRouter()
  const { getToken, userId } = useAuth()
  const { user, setUser } = useStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const courses = user?.courses
  const personalizationRef = useRef<HTMLDivElement | null>(null)
  const personalizationBottomRef = useRef<HTMLDivElement | null>(null)

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

  console.log(user)

  const styles: ('Text-based' | 'Visual Diagrams' | 'Project-focused' | '')[] =
    ['Text-based', 'Visual Diagrams', 'Project-focused', '']

  const handleGenerateCourse = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setGenerationProgress({
      lessons: [],
      quizzes: []
    })

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    let socket: WebSocket | null = null
    let courseId: string | null = null

    try {
      const token = await getToken()
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}`

      if (user?.plan === Plan.STARTER && user?.courses?.length >= 3) {
        toast.error("You've reached your free tier limit. Upgrade to Pro to continue.", { id: "limit-reach" });
        setIsGenerating(false)
        return;
      }

      if (user?.plan === Plan.PRO && new Date(user.planExpire!) < new Date()) {
        toast.error("Your Pro plan has expired. Please renew to continue.", { id: "pro-expired" });
        setIsGenerating(false)

        return;
      }


      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        socket?.send(
          JSON.stringify({
            topic: prompt,
            userId,
            token,
            personalization: {
              level,
              preferredTopics,
              dislikedTopics,
              goal,
              timeCommitment,
              learningStyle
            }
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

  return (
    <div className='h-screen flex flex-col bg-background overflow-hidden'>
      {/* Top Navigation */}
      <nav className='sticky top-0 z-50 bg-background/80 backdrop-blur border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2'>
              <BookOpen className='h-6 w-6 text-primary' />
              <span className='text-xl font-semibold tracking-tight'>
                Tutorly
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-2'>
              <Link href='/history'>
                <Button variant='outline' size='sm'>
                  <History className='mr-2 h-4 w-4' />
                  All Courses
                </Button>
              </Link>
              <ThemeToggle />
              <UserButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className='md:hidden inline-flex items-center p-2'
              onClick={() => setIsOpen(!isOpen)}
              aria-label='Toggle Menu'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className='md:hidden mt-2 space-y-2 pb-4'>
              <Link href='/history' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <History className='mr-2 h-4 w-4' />
                  All Courses
                </Button>
              </Link>
              <div className='flex gap-2'>
                <ThemeToggle />
                <UserButton />
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className='flex-1 flex flex-col overflow-y-auto lg:grid lg:grid-cols-[300px_1fr] lg:h-[calc(100vh-64px)]'>
        {/* Mobile collapsible sidebar */}
        <div className='lg:hidden p-2 border-b'>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant='outline'
                className='w-full flex items-center justify-center gap-2'
              >
                <Menu className='h-4 w-4' /> Courses
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='mt-2 max-h-[60vh] overflow-y-auto border rounded-md p-2'>
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
                    {courses?.length! > 0 ? (
                      courses?.map(course => (
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
                      <Card className='border-dashed border-2 border-gray-300 bg-muted/50 shadow-none'>
                        <CardContent className='flex flex-col items-center justify-center py-16 text-center text-gray-500'>
                          <div className='text-xl font-medium'>
                            No Course Generated Yet
                          </div>
                          <div className='mt-2 text-sm text-muted-foreground'>
                            Start generating a course to see it here.
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
        {/* Desktop sidebar */}
        <aside
          className='hidden lg:block h-full overflow-y-auto border-r p-4 
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
          dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900
        '
        >
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
                {courses?.length! > 0 ? (
                  courses?.map(course => (
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
                  <Card className='border-dashed border-2 border-gray-300 bg-muted/50 shadow-none'>
                    <CardContent className='flex flex-col items-center justify-center py-16 text-center text-gray-500'>
                      <div className='text-xl font-medium'>
                        No Course Generated Yet
                      </div>
                      <div className='mt-2 text-sm text-muted-foreground'>
                        Start generating a course to see it here.
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </Card>
          )}
        </aside>

        {/* Main Content - Course Generation */}
        {isGenerating ? (
          <div
            className='fixed inset-x-0 top-16 z-40 h-[calc(100vh-64px)] flex flex-col items-center justify-start bg-background/80 backdrop-blur-sm overflow-y-auto scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
          >
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='text-muted-foreground mb-6 px-4 text-center sm:px-0 sm:text-base text-sm'
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
                  <CardContent
                    className='overflow-y-auto max-h-[400px] pr-2 scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
                  >
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
                  <CardContent
                    className='overflow-y-auto max-h-[400px] pr-2 scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
                  >
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
          <motion.main
            className='order-2 flex-1 overflow-y-auto px-4 py-6'
            initial='hidden'
            animate='visible'
            variants={{ hidden: {}, visible: {} }}
          >
            <div className='max-w-3xl mx-auto'>
              {/* Title & Description */}
              <motion.div
                ref={personalizationRef}
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

                    <motion.div variants={fadeUp} custom={0.55}>
                      {showPersonalization ? (
                        <Card className='mt-6 border border-border bg-background/90 backdrop-blur-md shadow-lg rounded-xl'>
                          <CardHeader>
                            <CardTitle className='text-xl font-semibold'>
                              Personalize Your Course
                            </CardTitle>
                            <CardDescription>
                              Tailor the course to your experience level and
                              preferences.
                            </CardDescription>
                          </CardHeader>

                          <CardContent className='space-y-6'>
                            {/* Level */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                Select Your Level
                              </label>
                              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                                {[
                                  {
                                    label: 'Beginner',
                                    icon: Rocket,
                                    color: 'text-green-500'
                                  },
                                  {
                                    label: 'Intermediate',
                                    icon: TrendingUp,
                                    color: 'text-yellow-500'
                                  },
                                  {
                                    label: 'Advanced',
                                    icon: GraduationCap,
                                    color: 'text-red-500'
                                  }
                                ].map(({ label, icon: Icon, color }) => (
                                  <Button
                                    key={label}
                                    variant={
                                      level === label ? 'default' : 'outline'
                                    }
                                    onClick={() =>
                                      setLevel(label as typeof level)
                                    }
                                    className='flex items-center gap-2 text-sm w-full'
                                  >
                                    <Icon className={`h-5 w-5 ${color}`} />
                                    {label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Preferred Topics */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                Preferred Topics{' '}
                                <span className='text-muted-foreground'>
                                  (optional)
                                </span>
                              </label>
                              <Textarea
                                placeholder='e.g., React Hooks, State Management, Deployment'
                                value={preferredTopics}
                                onChange={e =>
                                  setPreferredTopics(e.target.value)
                                }
                                className='resize-none'
                              />
                            </div>

                            {/* Disliked Topics */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                Topics to Avoid{' '}
                                <span className='text-muted-foreground'>
                                  (optional)
                                </span>
                              </label>
                              <Textarea
                                placeholder='e.g., Redux, TypeScript'
                                value={dislikedTopics}
                                onChange={e =>
                                  setDislikedTopics(e.target.value)
                                }
                                className='resize-none'
                              />
                            </div>

                            {/* Goal */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                What’s your main goal?{' '}
                                <span className='text-muted-foreground'>
                                  (optional)
                                </span>
                              </label>
                              <Textarea
                                placeholder='e.g., I want to build a portfolio project / prepare for interviews / get certified'
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                className='resize-none'
                              />
                            </div>

                            {/* Learning Style */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                Preferred Learning Style{' '}
                                <span className='text-muted-foreground'>
                                  (optional)
                                </span>
                              </label>
                              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                                {styles.map(style => (
                                  <Button
                                    key={style}
                                    variant={
                                      learningStyle === style
                                        ? 'default'
                                        : 'outline'
                                    }
                                    onClick={() => setLearningStyle(style)}
                                    className='text-xs w-full'
                                  >
                                    {style || 'No Preference'}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Time Commitment */}
                            <div>
                              <label className='block text-sm font-medium mb-2 text-foreground'>
                                How many hours/week can you commit?{' '}
                                <span className='text-muted-foreground'>
                                  (optional)
                                </span>
                              </label>
                              <input
                                type='number'
                                min={1}
                                placeholder='e.g., 5'
                                value={timeCommitment}
                                onChange={e =>
                                  setTimeCommitment(e.target.value)
                                }
                                className='w-full rounded-md border px-3 py-2 bg-background border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                              />
                            </div>

                            {/* Generate Button */}
                            <Button
                              onClick={handleGenerateCourse}
                              disabled={isGenerating || !prompt.trim()}
                              className='w-full text-base py-2'
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
                          </CardContent>
                        </Card>
                      ) : (
                        <Button
                          onClick={() => {
                            setShowPersonalization(true)
                            setTimeout(() => {
                              personalizationRef.current?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              })
                              // Scroll to the bottom after showing personalization
                              personalizationBottomRef.current?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end'
                              })
                            }, 100)
                          }}
                          disabled={!prompt.trim()}
                          className='w-full mt-4'
                        >
                          Next: Personalize
                        </Button>
                      )}
                    </motion.div>

                    {/* Example Prompts */}
                    <motion.div
                      className='space-y-3'
                      variants={fadeUp}
                      custom={0.7}
                    >
                      <p className='text-sm font-medium'>Try these examples:</p>
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
          </motion.main>
        )}
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    </div>
  )
}
