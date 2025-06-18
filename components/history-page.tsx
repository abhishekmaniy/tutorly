'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Trophy, Calendar, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useStore } from '@/store/store'

export function HistoryPage () {
  const { user, getCourse } = useStore()

  const courses = [
    {
      id: 1,
      title: 'Introduction to React.js',
      description: 'Learn React from basics to advanced concepts',
      progress: 100,
      totalLessons: 8,
      totalQuizzes: 8,
      completedLessons: 8,
      completedQuizzes: 8,
      timeSpent: '4.5 hours',
      grade: 'Excellent',
      status: 'Completed',
      startDate: '2024-01-15',
      completedDate: '2024-01-20',
      thumbnail: '/placeholder.svg?height=120&width=200'
    },
    {
      id: 2,
      title: 'Python for Beginners',
      description: 'Master Python programming from scratch',
      progress: 75,
      totalLessons: 12,
      totalQuizzes: 12,
      completedLessons: 9,
      completedQuizzes: 9,
      timeSpent: '6.2 hours',
      grade: 'Good',
      status: 'In Progress',
      startDate: '2024-01-10',
      completedDate: null,
      thumbnail: '/placeholder.svg?height=120&width=200'
    },
    {
      id: 3,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML concepts and algorithms',
      progress: 45,
      totalLessons: 15,
      totalQuizzes: 15,
      completedLessons: 7,
      completedQuizzes: 6,
      timeSpent: '8.1 hours',
      grade: 'Average',
      status: 'In Progress',
      startDate: '2024-01-05',
      completedDate: null,
      thumbnail: '/placeholder.svg?height=120&width=200'
    },
    {
      id: 4,
      title: 'Web Development Fundamentals',
      description: 'HTML, CSS, and JavaScript essentials',
      progress: 30,
      totalLessons: 20,
      totalQuizzes: 20,
      completedLessons: 6,
      completedQuizzes: 6,
      timeSpent: '3.8 hours',
      grade: 'Needs Improvement',
      status: 'In Progress',
      startDate: '2024-01-01',
      completedDate: null,
      thumbnail: '/placeholder.svg?height=120&width=200'
    },
    {
      id: 5,
      title: 'Data Structures and Algorithms',
      description: 'Essential CS concepts for programming',
      progress: 85,
      totalLessons: 18,
      totalQuizzes: 18,
      completedLessons: 15,
      completedQuizzes: 16,
      timeSpent: '12.3 hours',
      grade: 'Excellent',
      status: 'In Progress',
      startDate: '2023-12-20',
      completedDate: null,
      thumbnail: '/placeholder.svg?height=120&width=200'
    }
  ]

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

  return (
    <div className='min-h-screen bg-background'>
      {/* Top Navigation */}
      <nav className='border-b'>
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
              <Avatar>
                <AvatarImage src='/placeholder.svg?height=32&width=32' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Your Learning History</h1>
          <p className='text-muted-foreground text-lg'>
            Track your progress across all courses and continue your learning
            journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className='grid gap-6 md:grid-cols-4 mb-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Courses
                  </p>
                  <p className='text-2xl font-bold'>{courses.length}</p>
                </div>
                <BookOpen className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Completed
                  </p>
                  <p className='text-2xl font-bold text-green-600'>
                    {courses.filter(c => c.status === 'Completed').length}
                  </p>
                </div>
                <Trophy className='h-8 w-8 text-green-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    In Progress
                  </p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {courses.filter(c => c.status === 'In Progress').length}
                  </p>
                </div>
                <Clock className='h-8 w-8 text-blue-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Time
                  </p>
                  <p className='text-2xl font-bold'>
                    {courses
                      .reduce((total, course) => {
                        const hours = Number.parseFloat(
                          course.timeSpent.split(' ')[0]
                        )
                        return total + hours
                      }, 0)
                      .toFixed(1)}
                    h
                  </p>
                </div>
                <Calendar className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {courses.map(course => (
            <Link key={course.id} href={`/course/${course.id}`}>
              <Card className='group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]'>
                <div className='aspect-video relative overflow-hidden rounded-t-lg'>
                  <img
                    src={course.thumbnail || '/placeholder.svg'}
                    alt={course.title}
                    className='w-full h-full object-cover transition-transform group-hover:scale-105'
                  />
                  <div className='absolute top-3 right-3'>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg line-clamp-2 group-hover:text-primary transition-colors'>
                        {course.title}
                      </CardTitle>
                      <CardDescription className='mt-1 line-clamp-2'>
                        {course.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0' />
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Progress */}
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span>Progress</span>
                      <span className='font-medium'>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className='h-2' />
                  </div>

                  {/* Stats */}
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>Lessons</p>
                      <p className='font-medium'>
                        {course.completedLessons}/{course.totalLessons}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Quizzes</p>
                      <p className='font-medium'>
                        {course.completedQuizzes}/{course.totalQuizzes}
                      </p>
                    </div>
                  </div>

                  {/* Grade and Time */}
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span>{course.timeSpent}</span>
                    </div>
                    <span
                      className={`font-medium ${getGradeColor(course.grade)}`}
                    >
                      {course.grade}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className='text-xs text-muted-foreground'>
                    <p>
                      Started: {new Date(course.startDate).toLocaleDateString()}
                    </p>
                    {course.completedDate && (
                      <p>
                        Completed:{' '}
                        {new Date(course.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <div className='text-center py-12'>
            <BookOpen className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
            <h2 className='text-2xl font-bold mb-2'>No courses yet</h2>
            <p className='text-muted-foreground mb-6'>
              Start your learning journey by creating your first course
            </p>
            <Link href='/prompt'>
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Progress } from '@/components/ui/progress'
// import { Badge } from '@/components/ui/badge'
// import { BookOpen, Clock, Trophy, Calendar, ArrowRight } from 'lucide-react'
// import { ThemeToggle } from '@/components/theme-toggle'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import Link from 'next/link'
// import { useStore } from '@/store/store'
// import { CourseStatus, Grade, Course } from '@/types'

// export function HistoryPage() {
//   const { user } = useStore()
//   const courses = user?.courses || []

//   const getStatusColor = (status: CourseStatus) => {
//     switch (status) {
//       case 'COMPLETED':
//         return 'bg-green-500'
//       case 'IN_PROGRESS':
//         return 'bg-blue-500'
//       default:
//         return 'bg-gray-500'
//     }
//   }

//   const getGradeColor = (grade: Grade) => {
//     switch (grade) {
//       case 'EXCELLENT':
//         return 'text-green-600'
//       case 'GOOD':
//         return 'text-blue-600'
//       case 'AVERAGE':
//         return 'text-yellow-600'
//       case 'NEEDS_IMPROVEMENT':
//         return 'text-red-600'
//       default:
//         return 'text-gray-600'
//     }
//   }

//   const completedCourses = courses.filter(c => c.status === 'COMPLETED').length
//   const inProgressCourses = courses.filter(c => c.status === 'IN_PROGRESS').length

//   return (
//     <div className="min-h-screen bg-background">
//       <nav className="border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex h-16 items-center justify-between">
//             <Link href="/" className="flex items-center space-x-2">
//               <BookOpen className="h-8 w-8 text-primary" />
//               <span className="text-2xl font-bold">Tutorly</span>
//             </Link>

//             <div className="flex items-center space-x-4">
//               <Link href="/prompt">
//                 <Button variant="outline" size="sm">
//                   Create New Course
//                 </Button>
//               </Link>
//               <ThemeToggle />
//               <Avatar>
//                 <AvatarImage src="/placeholder.svg?height=32&width=32" />
//                 <AvatarFallback>JD</AvatarFallback>
//               </Avatar>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Your Learning History</h1>
//           <p className="text-muted-foreground text-lg">
//             Track your progress across all courses and continue your learning journey
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-4 mb-8">
//           <StatCard label="Total Courses" value={courses.length} icon={<BookOpen className="h-8 w-8 text-primary" />} />
//           <StatCard label="Completed" value={completedCourses} icon={<Trophy className="h-8 w-8 text-green-600" />} valueClass="text-green-600" />
//           <StatCard label="In Progress" value={inProgressCourses} icon={<Clock className="h-8 w-8 text-blue-600" />} valueClass="text-blue-600" />
//           <StatCard label="Total Time" value="N/A" icon={<Calendar className="h-8 w-8 text-primary" />} />
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {courses.map(course => (
//             <Link key={course.id} href={`/course/${course.id}`}>
//               <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
//                 <CardHeader className="pb-3">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
//                         {course.title}
//                       </CardTitle>
//                       <CardDescription className="mt-1 line-clamp-2">
//                         {course.description}
//                       </CardDescription>
//                     </div>
//                     <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span>Progress</span>
//                       <span className="font-medium">{course.progress}%</span>
//                     </div>
//                     <Progress value={course.progress} className="h-2" />
//                   </div>

//                   <div className="flex items-center justify-between text-sm">
//                     <Badge className={getStatusColor(course.status)}>
//                       {course.status.replace('_', ' ')}
//                     </Badge>
//                     <span className={`font-medium ${getGradeColor(course.grade)}`}>
//                       {course.grade.replace('_', ' ')}
//                     </span>
//                   </div>

//                   <div className="text-xs text-muted-foreground">
//                     <p>
//                       Started: {new Date(course.createdAt).toLocaleDateString()}
//                     </p>
//                     {course.completedAt && (
//                       <p>
//                         Completed: {new Date(course.completedAt).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>

//         {courses.length === 0 && (
//           <div className="text-center py-12">
//             <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
//             <h2 className="text-2xl font-bold mb-2">No courses yet</h2>
//             <p className="text-muted-foreground mb-6">
//               Start your learning journey by creating your first course
//             </p>
//             <Link href="/prompt">
//               <Button>Create Your First Course</Button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function StatCard({
//   label,
//   value,
//   icon,
//   valueClass = ''
// }: {
//   label: string
//   value: string | number
//   icon: React.ReactNode
//   valueClass?: string
// }) {
//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-muted-foreground">{label}</p>
//             <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
//           </div>
//           {icon}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
