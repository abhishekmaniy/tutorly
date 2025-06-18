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
  return (
    <div>
      <div className='flex items-center mb-6'>
        <BarchartGraph className='mr-3 h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Course Analytics</h1>
          <p className='text-muted-foreground'>
            Your learning performance and insights
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analyticsData.timeSpent.total}h
            </div>
            <p className='text-xs text-muted-foreground'>
              Lessons: {analyticsData.timeSpent.lessons}h | Quizzes:{' '}
              {analyticsData.timeSpent.quizzes}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analyticsData.performance.averageScore}%
            </div>
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
            <p className='text-xs text-muted-foreground'>
              Based on your performance
            </p>
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
                        course.lessons.length +
                        course.lessons.length -
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
              <BarChart
                data={[
                  { name: 'Quiz 1', score: 85 },
                  { name: 'Quiz 2', score: 92 },
                  { name: 'Quiz 3', score: 78 },
                  { name: 'Quiz 4', score: 88 },
                  { name: 'Quiz 5', score: 95 }
                ]}
              >
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
            <LineChart
              data={[
                { day: 'Day 1', lessons: 1, quizzes: 0 },
                { day: 'Day 2', lessons: 3, quizzes: 2 },
                { day: 'Day 3', lessons: 5, quizzes: 4 },
                { day: 'Day 4', lessons: 6, quizzes: 5 },
                { day: 'Day 5', lessons: 8, quizzes: 7 }
              ]}
            >
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
