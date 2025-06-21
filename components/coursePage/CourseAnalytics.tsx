import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
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
import { BarChart as BarchartGraph } from 'lucide-react'
import { Course } from '@/lib/types'
import { differenceInCalendarDays } from 'date-fns'

const CourseAnalytics = ({
  analyticsData,
  completedQuizzes,
  completedLessons,
  course
}: {
  course: Course
  analyticsData: any
  completedQuizzes: string[]
  completedLessons: string[]
}) => {
  function formatMinutes (minutes: number) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const courseStartDate = new Date(course.createdAt)

  const completedLessonsWithDate = course.lessons
    .filter(lesson => lesson.isCompleted && lesson.completedAt)
    .map(lesson => ({
      type: 'lesson' as const,
      date: new Date(lesson.completedAt!)
    }))

  const completedQuizzesWithDate = course.lessons
    .map(lesson => lesson.quizz)
    .filter(q => q && q.isCompleted && q.completedAt)
    .map(q => ({
      type: 'quiz' as const,
      date: new Date(q!.completedAt!)
    }))

  const allCompletedItems = [...completedLessonsWithDate, ...completedQuizzesWithDate].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  const lessonCountsByDay = new Map<number, number>()
  const quizCountsByDay = new Map<number, number>()

  allCompletedItems.forEach(item => {
    const dayNumber = differenceInCalendarDays(item.date, courseStartDate) + 1
    if (item.type === 'lesson') {
      lessonCountsByDay.set(dayNumber, (lessonCountsByDay.get(dayNumber) || 0) + 1)
    } else if (item.type === 'quiz') {
      quizCountsByDay.set(dayNumber, (quizCountsByDay.get(dayNumber) || 0) + 1)
    }
  })

  const allDayNumbers = Array.from(
    new Set([...lessonCountsByDay.keys(), ...quizCountsByDay.keys()])
  ).sort((a, b) => a - b)

  const lineChartData = allDayNumbers.map(dayNumber => ({
    day: `Day ${dayNumber}`,
    lessons: lessonCountsByDay.get(dayNumber) || 0,
    quizzes: quizCountsByDay.get(dayNumber) || 0
  }))

  const completedQuizzesData = course.lessons
    .map(lesson => lesson.quizz)
    .filter(q => q && q.isCompleted)

  const quizBarChartData = completedQuizzesData.map((quiz, index) => ({
    name: quiz?.title || `Quiz ${index + 1}`,
    score: quiz?.gainedMarks || 0
  }))

  return (
    <div className=' overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent pr-2"' >
      <div className='flex items-center mb-6'>
        <BarchartGraph className='mr-3 h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Course Analytics</h1>
          <p className='text-muted-foreground'>Your learning performance and insights</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatMinutes(analyticsData.timeSpent.total)}</div>
            <p className='text-xs text-muted-foreground'>
              Lessons: {formatMinutes(analyticsData.timeSpent.lessons)} | Quizzes:{' '}
              {formatMinutes(analyticsData.timeSpent.quizzes)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analyticsData.performance.averageScore}%</div>
            <p className='text-xs text-muted-foreground'>
              {analyticsData.performance.passedQuizzes}/
              {analyticsData.performance.totalQuizzes} quizzes passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Overall Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {analyticsData.performance.grade}
            </div>
            <p className='text-xs text-muted-foreground'>Based on your performance</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Completed',
                      value: completedLessons.length + completedQuizzes.length
                    },
                    {
                      name: 'Remaining',
                      value:
                        course.lessons.length * 2 -
                        (completedLessons.length + completedQuizzes.length)
                    }
                  ]}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'
                >
                  <Cell fill='#8884d8' />
                  <Cell fill='#e5e7eb' />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={quizBarChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='score' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='lessons'
                stroke='#8884d8'
                name='Lessons Completed'
              />
              <Line
                type='monotone'
                dataKey='quizzes'
                stroke='#82ca9d'
                name='Quizzes Completed'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseAnalytics
