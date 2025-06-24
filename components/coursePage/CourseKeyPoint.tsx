'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { CheckCircle } from 'lucide-react'
import { Course } from '@/lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const CourseKeyPoint = ({ course }: { course: Course }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-3 sm:p-0 "
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="flex items-center mb-2">
        <CheckCircle className="mr-3 h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Key Points</h1>
          <p className="text-muted-foreground">Important concepts to remember</p>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div variants={containerVariants} className="space-y-6">
        {course.keyPoints.map((category, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="outline" className="mr-3">
                    {category.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul variants={containerVariants} className="space-y-3">
                  {category.points.map((point, pointIndex) => (
                    <motion.li
                      key={pointIndex}
                      variants={itemVariants}
                      className="flex items-start"
                    >
                      <div className="mr-3 h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default CourseKeyPoint
