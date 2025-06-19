'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Sparkles, ArrowRight, History } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { useStore } from '@/store/store'
import { Skeleton } from './ui/skeleton'
import { motion, Variants } from 'framer-motion'

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

export function PromptPage () {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { getToken, userId } = useAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { courses, setUser } = useStore()

  useEffect(() => {
    const controller = new AbortController()

    const getCourses = async () => {
      if (!userId) return

      try {
        const token = await getToken()
        console.log(token)

        const response = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        setUser(response.data)
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message)
        } else {
          console.error('Error fetching user:', error)
        }
      }
    }

    getCourses()

    return () => {
      controller.abort() // 🛑 Cancel request on unmount
    }
  }, [userId])

  const handleGenerateCourse = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      const token = await getToken()

      const response = await axios.post(
        '/api/generate-course',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = response.data

      router.push(`/course/${data.id}`)
    } catch (error) {
      console.log('Error', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='h-screen overflow-hidden bg-background'>
      {/* Top Navigation */}
      <nav className='sticky top-0 z-50 border-b bg-background'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link href='/' className='flex items-center space-x-2'>
              <BookOpen className='h-8 w-8 text-primary' />
              <span className='text-2xl font-bold'>Tutorly</span>
            </Link>

            <div className='flex items-center space-x-4'>
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
          <motion.div
            className='lg:col-span-1'
            variants={fadeUp}
            initial='hidden'
            animate='visible'
          >
            <Card className='h-full'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Clock className='mr-2 h-5 w-5' /> Recent Courses
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>

              <CardContent
                className='space-y-4 overflow-y-auto pr-2 custom-scrollbar'
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              >
                {courses.length > 0 ? (
                  courses.map(course => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Link href={`/course/${course.id}`}>
                        <Card className='cursor-pointer transition-colors hover:bg-muted/50'>
                          <CardContent className='p-4'>
                            <h4 className='font-medium mb-2'>{course.title}</h4>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm text-muted-foreground'>
                                <span>{course.lessons.length} lessons</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className='w-full bg-muted rounded-full h-2'>
                                <div
                                  className='bg-primary h-2 rounded-full transition-all'
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <p className='text-xs text-muted-foreground'>
                                {course.createdAt}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className='space-y-4'>
                    {/* Skeletons */}
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className='p-4 space-y-2'>
                          <Skeleton className='h-5 w-3/4' />
                          <Skeleton className='h-4 w-1/2' />
                          <Skeleton className='h-2 w-full' />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Course Generation */}
          {isGenerating ? (
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6 rounded-lg'>
              <div className='animate-spin mb-4'>
                <BookOpen className='h-10 w-10 text-primary' />
              </div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Generating Your Course...
              </h2>
              <p className='text-center text-muted-foreground max-w-md text-sm'>
                This might take <span className='font-medium'>2-3 minutes</span>{' '}
                depending on the complexity of your topic. Sit back, relax, and
                we’ll build your personalized course.
              </p>
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
        </div>
      </div>
    </div>
  )
}
