import { ArrowRight, CheckCircle, Target } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Course } from '@/lib/types'

const CourseSummary = ({course}:{course:Course}) => {
  return (
    <div>
      <div className='flex items-center mb-6'>
        <Target className='mr-3 h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Course Summary</h1>
          <p className='text-muted-foreground'>
            Overview of what you've learned
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground leading-relaxed'>
              {course.summary?.overview}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What You Learned</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {course.summary?.whatYouLearned.map((item, index) => (
                <li key={index} className='flex items-start'>
                  <CheckCircle className='mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Gained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {course.summary?.skillsGained.map((skill, index) => (
                <Badge key={index} variant='secondary'>
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {course.summary?.nextSteps.map((step, index) => (
                <li key={index} className='flex items-start'>
                  <ArrowRight className='mr-3 h-4 w-4 text-primary flex-shrink-0 mt-1' />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CourseSummary
