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
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/store/store'
import { useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { circOut, motion } from 'framer-motion'
import { BookOpen, Calendar, Clock, PlusCircle, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // stagger between cards
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as any
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: circOut
    }
  }
}

export function HistoryPage () {
  const { user, setUser } = useStore()
  const { getToken, userId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const course2 = user?.courses

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const token = await getToken()
        const response = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setUser(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false) // Mark loading complete
      }
    }

    fetchData()
  }, [getToken, userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500'
      case 'In Progress':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent':
        return 'text-green-600'
      case 'Good':
        return 'text-blue-600'
      case 'Average':
        return 'text-yellow-600'
      case 'Needs Improvement':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  function formatDurationFromMs (ms: number) {
    const totalMinutes = Math.floor(ms / 1000 / 60)
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div className='h-screen flex flex-col bg-background'>
      {/* Top Navigation */}
      <nav className='sticky top-0 z-50 border-b bg-background'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link href='/' className='flex items-center space-x-2'>
              <BookOpen className='h-8 w-8 text-primary' />
              <span className='text-2xl font-bold'>Tutorly</span>
            </Link>

            <div className='flex items-center space-x-4'>
              <Link href='/prompt'>
                <Button variant='outline' size='sm'>
                  Create New Course
                </Button>
              </Link>
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <div className='flex-1 overflow-hidden'>
        <div className='container mx-auto px-4 py-4'>
          <motion.div
            className='mb-8'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <h1 className='text-4xl font-bold mb-2'>Your Learning History</h1>
            <p className='text-muted-foreground text-lg'>
              Track your progress across all courses and continue your learning
              journey
            </p>
          </motion.div>

          {/* Stats Overview */}
          {/* ✅ Loading Skeletons for Stats Overview */}

          {isLoading ? (
            <div className='grid gap-6 md:grid-cols-4 mb-8'>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className='h-24 w-full rounded-lg' />
              ))}
            </div>
          ) : (
            <motion.div
              className='grid gap-6 md:grid-cols-4 mb-8'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {[
                {
                  label: 'Total Courses',
                  value: course2?.length,
                  icon: <BookOpen className='h-8 w-8 text-primary' />
                },
                {
                  label: 'Completed',
                  value: course2?.filter(c => c.status === 'COMPLETED').length,
                  color: 'text-green-600',
                  icon: <Trophy className='h-8 w-8 text-green-600' />
                },
                {
                  label: 'In Progress',
                  value: course2?.filter(c => c.status === 'IN_PROGRESS')
                    .length,
                  color: 'text-blue-600',
                  icon: <Clock className='h-8 w-8 text-blue-600' />
                },
                {
                  label: 'Total Time',
                  value:
                    (course2?.reduce((total, course) => {
                      const lessons = course.lessons
                      const lessonTimeSpent = lessons
                        .map(lesson => lesson?.timeTaken || 0)
                        .reduce((acc, curr) => acc + curr, 0)
                      const quizTimeSpent = lessons
                        .map(lesson => lesson.quizz?.timeTaken || 0)
                        .reduce((acc, curr) => acc + curr, 0)
                      return total + lessonTimeSpent + quizTimeSpent
                    }, 0) || 0) + 'h',
                  icon: <Calendar className='h-8 w-8 text-primary' />
                }
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card>
                    <CardContent className='pt-6'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            {item.label}
                          </p>
                          <p
                            className={`text-2xl font-bold ${item.color || ''}`}
                          >
                            {item.value}
                          </p>
                        </div>
                        {item.icon}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Courses Grid */}
        <div className='flex-1 overflow-y-auto px-4 pb-6'>
          {isLoading ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className='h-[300px] w-full rounded-xl' />
              ))}
            </div>
          ) : (
            <motion.div
              className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {course2?.map(course => (
                <motion.div key={course.id} variants={cardVariants}>
                  <Link href={`/course/${course.id}`}>
                    <Card className='group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] rounded-2xl overflow-hidden'>
                      <div className='aspect-video relative overflow-hidden'>
                        <img
                          src={'/placeholder.svg'}
                          alt={course.title}
                          className='w-full h-full object-cover transition-transform group-hover:scale-110'
                        />
                        <div className='absolute top-3 right-3 z-10'>
                          <Badge className={getStatusColor(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className='pb-3 space-y-1'>
                        <CardTitle className='text-lg line-clamp-2 group-hover:text-primary transition-colors'>
                          {course.title}
                        </CardTitle>
                        <CardDescription className='line-clamp-2'>
                          {course.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className='space-y-4'>
                        {/* Progress */}
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span className='text-muted-foreground'>
                              Progress
                            </span>
                            <span className='font-medium'>
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} className='h-2' />
                        </div>

                        {/* Stats */}
                        <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
                          <div>
                            <p>Lessons</p>
                            <p className='font-medium text-foreground'>
                              {
                                course.lessons.filter(
                                  lesson => lesson.isCompleted
                                ).length
                              }
                              /{course.lessons.length}
                            </p>
                          </div>
                          <div>
                            <p>Quizzes</p>
                            <p className='font-medium text-foreground'>
                              {
                                course.lessons.filter(
                                  lesson =>
                                    lesson.quizz && lesson.quizz.isCompleted
                                ).length
                              }
                              /{course.lessons.length}
                            </p>
                          </div>
                        </div>

                        {/* Grade and Time */}
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-1.5 text-muted-foreground'>
                            <Clock className='h-4 w-4' />
                            <span>
                              {formatDurationFromMs(
                                course.lessons.reduce((total, lesson) => {
                                  const lessonTime = lesson?.timeTaken || 0
                                  const quizTime = lesson.quizz?.timeTaken || 0
                                  return total + lessonTime + quizTime
                                }, 0)
                              )}
                            </span>
                          </div>
                          <span
                            className={`font-medium ${getGradeColor(
                              course.grade
                            )}`}
                          >
                            {course.grade}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className='text-xs text-muted-foreground space-y-0.5'>
                          <p>
                            Started:{' '}
                            {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                          {course.completedAt && (
                            <p>
                              Completed:{' '}
                              {new Date(
                                course.completedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}{' '}
            </motion.div>
          )}
        </div>
      
        {!isLoading && course2?.length === 0 && (
          <motion.div
            className='text-center py-20'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className='text-center py-20'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='inline-flex items-center justify-center p-4 bg-muted rounded-full shadow-lg mb-6'
              >
                <BookOpen className='h-12 w-12 text-primary' />
              </motion.div>

              <h2 className='text-3xl font-extrabold tracking-tight mb-2'>
                No Courses Yet
              </h2>
              <p className='text-muted-foreground mb-6 text-base'>
                Start your learning journey by creating your first course.
              </p>

              <Link href='/prompt'>
                <Button
                  size='lg'
                  className='inline-flex gap-2 px-6 py-3 text-base font-medium bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg'
                >
                  <PlusCircle className='h-5 w-5' />
                  Create Your First Course
                </Button>
              </Link>
            </motion.div>{' '}
          </motion.div>
        )}
      </div>
    </div>
  )
}
