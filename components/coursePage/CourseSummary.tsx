'use client'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Target } from 'lucide-react'
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Course } from '@/lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const CourseSummary = ({ course }: { course: Course }) => {
  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='space-y-8'
    >
      {/* Header */}
      <motion.div variants={itemVariants} className='flex items-center mb-2'>
        <Target className='mr-3 h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Course Summary</h1>
          <p className='text-muted-foreground'>
            Overview of what you've learned
          </p>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div variants={containerVariants} className='space-y-6'>
        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>What You Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.ul variants={containerVariants} className='space-y-3'>
                {course.summary?.whatYouLearned.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className='flex items-start'
                  >
                    <CheckCircle className='mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Skills Gained</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                className='flex flex-wrap gap-2'
              >
                {course.summary?.skillsGained.map((skill, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Badge variant='secondary'>{skill}</Badge>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.ul variants={containerVariants} className='space-y-2'>
                {course.summary?.nextSteps.map((step, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className='flex items-start'
                  >
                    <ArrowRight className='mr-3 h-4 w-4 text-primary flex-shrink-0 mt-1' />
                    <span>{step}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default CourseSummary
