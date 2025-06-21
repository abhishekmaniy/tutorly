import { Award, Clock, Target, Trophy } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Course } from '@/lib/types'

const CourseComplete = ({
  analyticsData,
  setShowAnalytics,
  setCourseComplete,
  
}: {
  analyticsData: any
  setCourseComplete:any
  setShowAnalytics: any
}) => {



  return (
    <div>
      <div className='text-center py-12'>
        <Trophy className='mx-auto mb-6 h-24 w-24 text-yellow-500' />
        <h1 className='text-4xl font-bold mb-4'>Congratulations! 🎉</h1>
        <p className='text-xl text-muted-foreground mb-8'>
          You have successfully completed the entire course!
        </p>

        <div className='grid gap-6 md:grid-cols-3 mb-8 max-w-4xl mx-auto'>
          <Card className='text-center'>
            <CardContent className='pt-6'>
              <Clock className='mx-auto mb-2 h-8 w-8 text-primary' />
              <h3 className='font-semibold'>Time Invested</h3>
              <p className='text-2xl font-bold'>
                {analyticsData.timeSpent.total} Minutes
              </p>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='pt-6'>
              <Award className='mx-auto mb-2 h-8 w-8 text-primary' />
              <h3 className='font-semibold'>Final Grade</h3>
              <p className='text-2xl font-bold text-green-600'>
                {analyticsData.performance.grade}
              </p>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='pt-6'>
              <Target className='mx-auto mb-2 h-8 w-8 text-primary' />
              <h3 className='font-semibold'>Completion Rate</h3>
              <p className='text-2xl font-bold'>100%</p>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Button size='lg' className='mr-4'>
            <Award className='mr-2 h-5 w-5' />
            Download Certificate
          </Button>
          <Button
            variant='outline'
            size='lg'
            onClick={() => {
              setShowAnalytics(true)
              setCourseComplete(false)
            }}
          >
            View Detailed Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseComplete
