'use client'

import { ThemeToggle } from '@/components/common/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Lesson } from '@/lib/types'
import { useStore } from '@/store/store'
import { useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { motion } from 'framer-motion'
import { BookOpen, History } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import CourseContent from './CourseContent'
import Sidebar from './Sidebar'

interface CoursePageProps {
  courseId: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function CoursePage ({ courseId }: CoursePageProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [quizzesOpen, setQuizzesOpen] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showKeyPoints, setShowKeyPoints] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

  const { getToken } = useAuth()
  const { addCourse, user, setUser, updateLessonProgress } = useStore()

  const course = user?.courses.find(c => c.id === courseId)
  const lessons = course?.lessons || []

  const lessonTimeSpent = lessons
    .map(lesson => lesson?.timeTaken || 0)
    .reduce((acc, curr) => acc + curr, 0)

  const quizTimeSpent = lessons
    ?.map(lesson => lesson.quizz?.timeTaken || 0)
    .reduce((acc, curr) => acc + curr, 0)

  const averageScore = course
    ? (() => {
        const completedQuizzes = course.lessons
          .map(lesson => lesson.quizz)
          .filter(quiz => quiz && quiz.isCompleted)

        const totalPossibleMarks = completedQuizzes.reduce(
          (acc, quiz) => acc + quiz?.totalMarks!,
          0
        )

        const totalGainedMarks = completedQuizzes.reduce(
          (acc, quiz) => acc + quiz?.gainedMarks!,
          0
        )

        if (totalPossibleMarks === 0) return 0

        return Math.round((totalGainedMarks / totalPossibleMarks) * 100)
      })()
    : 0

  function getGrade (
    score: number
  ): 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 50) return 'Average'
    return 'Needs Improvement'
  }

  const grade = getGrade(averageScore)

  const analyticsData = useMemo(
    () => ({
      timeSpent: {
        total: lessonTimeSpent + quizTimeSpent,
        lessons: lessonTimeSpent,
        quizzes: quizTimeSpent
      },
      performance: {
        averageScore: averageScore,
        totalQuizzes: lessons.length,
        passedQuizzes: completedQuizzes.length,
        grade
      },
      progress: {
        lessonsCompleted: completedLessons.length,
        quizzesCompleted: completedQuizzes.length,
        totalLessons: lessons.length || 0,
        totalQuizzes: lessons.length || 0
      }
    }),
    [completedLessons.length, completedQuizzes.length, course]
  )

  useEffect(() => {
    const container = mainRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const [courseRes, userRes] = await Promise.all([
          axios.get(`/api/course?id=${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`/api/user`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        addCourse(courseRes.data)
        setUser(userRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false) // Mark loading complete
      }
    }

    fetchData()
  }, [getToken, courseId, addCourse, setUser])

  useEffect(() => {
    if (course) {
      const completedLessonIds = course.lessons
        .filter(l => l.isCompleted)
        .map(l => l.id)
      const completedQuizIds = course.lessons
        .map(lesson => lesson.quizz)
        .filter(quiz => quiz && quiz.isCompleted)
        .map(quiz => quiz!.id)

      setCompletedLessons(completedLessonIds)
      setCompletedQuizzes(completedQuizIds)
    }
  }, [course])

  const lessonStartTimeRef = useRef<number | null>(null)
  const handleSelectLesson = (lesson: Lesson) => {
    lessonStartTimeRef.current = Date.now()
  }
  useEffect(() => {}, [completedLessons, completedQuizzes, courseId])

  const progress = useMemo(() => {
    const totalItems = (course?.lessons.length || 0) * 2
    const completedItems = completedLessons.length + completedQuizzes.length
    return totalItems ? Math.round((completedItems / totalItems) * 100) : 0
  }, [course, completedLessons.length, completedQuizzes.length])

  console.log('Completed Lesson Id', completedLessons)

  const handleLessonComplete = async (lessonId: string) => {
    const startTime = lessonStartTimeRef.current
    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime))
      : 0

    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev // Avoid duplicate
      return [...prev, lessonId]
    })

    await new Promise(resolve => requestAnimationFrame(resolve))

    const totalItems = (course?.lessons.length || 0) * 2
    const completedItems = completedLessons.length + 1 + completedQuizzes.length
    const latestProgress = totalItems
      ? Math.round((completedItems / totalItems) * 100)
      : 0

    updateLessonProgress(courseId, lessonId, timeTaken)

    await axios.post('/api/complete-lesson', {
      lessonId,
      courseId,
      timeTaken
    })

    if (course) {
      checkAndHandleCourseCompletion()
    }

    await axios.post('/api/progress', {
      courseId,
      progress: latestProgress
    })
  }

  useEffect(() => {
    if (course?.completedAt) {
      setCourseCompleted(true)
    }
  }, [course])

  const checkAndHandleCourseCompletion = async () => {
    try {
      const token = await getToken()
      const response = await axios.get(
        `/api/course-completed?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = response.data
      setCourseCompleted(data.completed)

      if (data.completed) {
        setSelectedLesson(null)
        setSelectedQuiz(null)
        setShowSummary(false)
        setShowKeyPoints(false)
        setShowAnalytics(false)
      }
    } catch (error) {
      console.error('Error checking course completion:', error)
    }
  }

  const handleQuizComplete = async (lessonId: string) => {
    if (course) {
      const lesson = course.lessons.filter(lesson => lesson.id === lessonId)[0]

      if (
        lesson &&
        lesson.quizz &&
        !completedQuizzes.includes(lesson.quizz.id)
      ) {
        setCompletedQuizzes(prev => [...prev, lesson.quizz!.id])
      }

      await new Promise(resolve => requestAnimationFrame(resolve))

      if (course) {
        checkAndHandleCourseCompletion()
      }

      const totalItems = (course?.lessons.length || 0) * 2
      const completedItems =
        completedLessons.length + 1 + completedQuizzes.length
      const latestProgress = totalItems
        ? Math.round((completedItems / totalItems) * 100)
        : 0

      await axios.post('/api/progress', {
        courseId,
        progress: latestProgress
      })
    }
  }

  const renderLessonContent = (lessionId: string) => {
    const lesson = course?.lessons.filter(lession => lession.id === lessionId)

    if (!lesson) return null

    return lesson
  }

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (selectedLesson) {
      handleSelectLesson(selectedLesson)
    }
  }, [selectedLesson, showSummary, showKeyPoints, showAnalytics])

  return (
    <div className='h-screen grid grid-rows-[auto_1fr] bg-background'>
      {/* Navbar */}
      <nav className='h-16 border-b sticky top-0 z-50 bg-background'>
        <nav className='h-16 border-b sticky top-0 z-50 bg-background'>
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
      </nav>

      {/* Main content */}
      <div className='grid grid-cols-1 lg:grid-cols-4 h-full'>
        {/* SIDEBAR - Sticky */}
        <aside
          className='lg:col-span-1 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r p-4 scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
        >
          {isLoading ? (
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
                  <Skeleton className='h-10 w-full rounded-lg' />{' '}
                  {/* Lessons */}
                  <Skeleton className='h-10 w-full rounded-lg' />{' '}
                  {/* Quizzes */}
                  <Skeleton className='h-10 w-full rounded-lg' />{' '}
                  {/* Summary */}
                  <Skeleton className='h-10 w-full rounded-lg' />{' '}
                  {/* Key Points */}
                  <Skeleton className='h-10 w-full rounded-lg' />{' '}
                  {/* Analytics */}
                </div>
              </Card>
            </motion.div>
          ) : (
            <Sidebar
              setCourseCompleted={setCourseCompleted}
              course={course!}
              progress={progress}
              quizzesOpen={quizzesOpen}
              courseCompleted={courseCompleted}
              lessonsOpen={lessonsOpen}
              completedLessons={completedLessons}
              completedQuizzes={completedQuizzes}
              selectedLesson={selectedLesson}
              selectedQuiz={selectedQuiz}
              showAnalytics={showAnalytics}
              showSummary={showSummary}
              showKeyPoints={showKeyPoints}
              setLessonsOpen={setLessonsOpen}
              setQuizzesOpen={setQuizzesOpen}
              setSelectedLesson={setSelectedLesson}
              setSelectedQuiz={setSelectedQuiz}
              setShowAnalytics={setShowAnalytics}
              setShowSummary={setShowSummary}
              setShowKeyPoints={setShowKeyPoints}
            />
          )}
        </aside>

        {/* MAIN CONTENT - Scrollable */}
        <main
          ref={mainRef}
          className='lg:col-span-3 overflow-y-auto h-[calc(100vh-64px)] p-6 border-r scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
        >
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <BookOpen className='h-12 w-12 text-primary animate-pulse mb-4' />
              <h2 className='text-xl font-semibold'>Getting your course...</h2>
            </div>
          ) : (
            <CourseContent
              setShowSummary={setShowSummary}
              setCourseCompleted={setCourseCompleted}
              handleLessonComplete={handleLessonComplete}
              analyticsData={analyticsData}
              completedLessons={completedLessons}
              completedQuizzes={completedQuizzes}
              renderLessonContent={renderLessonContent}
              course={course!}
              courseCompleted={courseCompleted}
              selectedLesson={selectedLesson}
              selectedQuiz={selectedQuiz}
              showAnalytics={showAnalytics}
              showSummary={showSummary}
              showKeyPoints={showKeyPoints}
              setSelectedLesson={setSelectedLesson}
              setSelectedQuiz={setSelectedQuiz}
              setCompletedLessons={setCompletedLessons}
              setShowAnalytics={setShowAnalytics}
              handleQuizComplete={handleQuizComplete}
            />
          )}
        </main>
      </div>
    </div>
  )
}
