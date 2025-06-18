import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { CheckCircle } from 'lucide-react'
import { Course } from '@/lib/types'

const CourseKeyPoint = ({ course }: { course: Course }) => {
  return (
    <div>
      <div className='flex items-center mb-6'>
        <CheckCircle className='mr-3 h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Key Points</h1>
          <p className='text-muted-foreground'>
            Important concepts to remember
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        {course.keyPoints.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Badge variant='outline' className='mr-3'>
                  {category.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                {category.points.map((point, pointIndex) => (
                  <li key={pointIndex} className='flex items-start'>
                    <div className='mr-3 h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2' />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CourseKeyPoint
