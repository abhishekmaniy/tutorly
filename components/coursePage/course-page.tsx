'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Lesson, Quiz } from '@/lib/types'
import { useStore } from '@/store/store'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { BookOpen, History } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import CourseContent from './CourseContent'
import Sidebar from './Sidebar'
import { Skeleton } from '../ui/skeleton'

interface CoursePageProps {
  courseId: string
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
  const { addCourse, user, setUser } = useStore()

  const course = user?.courses.find(c => c.id === courseId)

  const analyticsData = useMemo(
    () => ({
      timeSpent: { total: 4.5, lessons: 3.2, quizzes: 1.3 },
      performance: {
        averageScore: 85,
        totalQuizzes: 8,
        passedQuizzes: 7,
        grade: 'Excellent'
      },
      progress: {
        lessonsCompleted: completedLessons.length,
        quizzesCompleted: completedQuizzes.length,
        totalLessons: course?.lessons.length || 0,
        totalQuizzes: course?.lessons.length || 0
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

  console.log('Lessons', course?.lessons)

  const checkCourseCompletion = () => {
    return (
      completedLessons.length === (course?.lessons.length || 0) &&
      completedQuizzes.length === (course?.lessons.length || 0)
    )
  }

  useEffect(() => {
    setCourseCompleted(checkCourseCompletion())
  }, [completedLessons, completedQuizzes, course])

  const progress = useMemo(() => {
    const totalItems = (course?.lessons.length || 0) * 2
    const completedItems = completedLessons.length + completedQuizzes.length
    return totalItems ? Math.round((completedItems / totalItems) * 100) : 0
  }, [course, completedLessons.length, completedQuizzes.length])

  const handleLessonComplete = async (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId])
      await axios.post('/api/complete-lesson', { lessonId, courseId })
    }
  }

  console.log('COmpeltedQuiz', completedQuizzes)

  const handleQuizComplete = (lessonId: string) => {
    if (course) {
      const lesson = course.lessons.filter(lesson => lesson.id === lessonId)[0]

      if (
        lesson &&
        lesson.quizz &&
        !completedQuizzes.includes(lesson.quizz.id)
      ) {
        setCompletedQuizzes(prev => [...prev, lesson.quizz!.id])
      }
    }
  }

  const renderLessonContent = (lessionId: string) => {
    const lesson = course?.lessons.filter(lession => lession.id === lessionId)

    if (!lesson) return null

    return lesson
  }

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
                <Avatar>
                  <AvatarImage src='/placeholder.svg?height=32&width=32' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </nav>
      </nav>

      {/* Main content */}
      <div className='grid grid-cols-1 lg:grid-cols-4 h-full'>
        {/* SIDEBAR - Sticky */}
        <aside className='lg:col-span-1 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r p-4'>
          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-12 w-3/4 rounded' /> {/* Title skeleton */}
              {/* Description line 1 */}
              <Skeleton className='h-10 w-full rounded' />{' '}
              <Skeleton className='h-10 w-3/4 rounded' />{' '}
              {/* Description line 2 */}
              <Skeleton className='h-8 w-full rounded' />{' '}
              {/* Description line 3 */}
              <div className='space-y-2'>
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                {/* Progress bar skeleton */}
              </div>
              <Skeleton className='h-8 w-full rounded' />{' '}
              <div className='space-y-2'>
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
                <Skeleton className='h-6 w-3/4 rounded' />{' '}
              </div>
            </div>
          ) : (
            <Sidebar
              course={course!}
              progress={progress}
              quizzesOpen={quizzesOpen}
              lessonsOpen={lessonsOpen}
              completedLessons={completedLessons}
              completedQuizzes={completedQuizzes}
              selectedLesson={selectedLesson}
              selectedQuiz={selectedQuiz}
              showAnalytics={showAnalytics}
              showSummary={showSummary}
              showKeyPoints={showKeyPoints}
              courseCompleted={courseCompleted}
              setLessonsOpen={setLessonsOpen}
              setQuizzesOpen={setQuizzesOpen}
              setSelectedLesson={setSelectedLesson}
              setSelectedQuiz={setSelectedQuiz}
              setShowAnalytics={setShowAnalytics}
              setShowSummary={setShowSummary}
              setShowKeyPoints={setShowKeyPoints}
              setCourseCompleted={setCourseCompleted}
              checkCourseCompletion={checkCourseCompletion}
            />
          )}
        </aside>

        {/* MAIN CONTENT - Scrollable */}
        <main
          ref={mainRef}
          className='lg:col-span-3 overflow-y-auto h-[calc(100vh-64px)] p-6'
        >
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <BookOpen className='h-12 w-12 text-primary animate-pulse mb-4' />
              <h2 className='text-xl font-semibold'>Getting your course...</h2>
            </div>
          ) : (
            <CourseContent
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
