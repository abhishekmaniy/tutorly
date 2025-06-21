export type User = {
  id: string
  email: string
  name?: string | null
  createdAt: string
  courses: Course[]
}

export type Course = {
  id: string
  title: string
  description: string
  createdAt: string
  userId: string
  user?: User
  lessons: Lesson[]
  status: CourseStatus
  progress: number
  grade: Grade
  completedAt?: string | null

  summary?: Summary
  keyPoints: KeyPoint[]
  analytics?: Analytics
}

export type Lesson = {
  id: string
  title: string
  description: string
  order: number
  duration: string
  completedAt: string | null
  timeTaken: number
  isCompleted: boolean
  courseId: string
  course?: Course
  contentBlocks: ContentBlock[]
  quizz: Quiz | null
}

export type ContentBlock = {
  id: string
  lessonId: string
  order: number
  type: 'CODE' | 'MATH' | 'GRAPH' | 'TEXT'
  text?: string | null
  code?: string | null
  math?: string | null
  graph?: any | null
}

export type Quiz = {
  id: string
  title: string
  duration: string
  totalMarks: number
  passingMarks: number
  isCompleted: boolean
  completedAt: string | null
  lessonId: string
  timeTaken: number
  lesson?: Lesson
  status: QuizStatus
  gainedMarks: number
  questions: QuizQuestion[]
}

export type QuizQuestion = {
  id: string
  quizId: string
  number: number
  quiz?: Quiz
  question: string
  type: QuestionType
  isCorrect: boolean
  options: string[]
  marks: number
  correctAnswers: string[]
  explanation: string
  rubric: string[]
}

export type Summary = {
  id: string
  courseId: string
  course?: Course
  overview: string
  whatYouLearned: string[]
  skillsGained: string[]
  nextSteps: string[]
}

export type KeyPoint = {
  id: string
  courseId: string
  course?: Course
  category: string
  points: string[]
}

export type Analytics = {
  id: string
  courseId: string
  course?: Course

  // timeSpent
  timeSpentTotal: number
  timeSpentLessons: number
  timeSpentQuizzes: number

  // performance
  averageScore: number
  totalQuizzes: number
  passedQuizzes: number
  grade: Grade

  // progress
  lessonsCompleted: number
  quizzesCompleted: number
  totalLessons: number
}

export type QuestionType =
  | 'MCQ'
  | 'MULTIPLE_SELECT'
  | 'DESCRIPTIVE'
  | 'TRUE_FALSE'

export type CourseStatus = 'IN_PROGRESS' | 'COMPLETED'

export type Grade =
  | 'EXCELLENT'
  | 'GOOD'
  | 'AVERAGE'
  | 'NEEDS_IMPROVEMENT'
  | 'NOT_GRADED'

export type QuizStatus = 'PASS' | 'FAIL'
