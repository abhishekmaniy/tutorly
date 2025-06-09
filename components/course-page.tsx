"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  History,
  Trophy,
  Target,
  Clock,
  ChevronLeft,
  ArrowRight,
  Award,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { QuizComponent } from "@/components/quiz-component"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface CoursePageProps {
  courseId: string
}

export function CoursePage({ courseId }: CoursePageProps) {
  const [selectedLesson, setSelectedLesson] = useState(1)
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([])
  const [lessonsOpen, setLessonsOpen] = useState(true)
  const [quizzesOpen, setQuizzesOpen] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [showKeyPoints, setShowKeyPoints] = useState(false)

  // Add analytics data
  const analyticsData = {
    timeSpent: {
      total: 4.5, // hours
      lessons: 3.2,
      quizzes: 1.3,
    },
    performance: {
      averageScore: 85,
      totalQuizzes: 8,
      passedQuizzes: 7,
      grade: "Excellent",
    },
    progress: {
      lessonsCompleted: completedLessons.length,
      quizzesCompleted: completedQuizzes.length,
      totalLessons: 8,
      totalQuizzes: 8,
    },
  }

  // Add this function to check course completion
  const checkCourseCompletion = () => {
    const allLessonsCompleted = completedLessons.length === course.totalLessons
    const allQuizzesCompleted = completedQuizzes.length === course.totalQuizzes
    return allLessonsCompleted && allQuizzesCompleted
  }

  // Mock course data
  const course = {
    title: "Introduction to React.js",
    description: "Learn React from basics to advanced concepts",
    totalLessons: 8,
    totalQuizzes: 8,
    lessons: [
      { id: 1, title: "What is React?", duration: "15 min" },
      { id: 2, title: "Setting up Development Environment", duration: "20 min" },
      { id: 3, title: "JSX and Components", duration: "25 min" },
      { id: 4, title: "Props and State", duration: "30 min" },
      { id: 5, title: "Event Handling", duration: "20 min" },
      { id: 6, title: "React Hooks", duration: "35 min" },
      { id: 7, title: "State Management", duration: "40 min" },
      { id: 8, title: "Building a Complete App", duration: "45 min" },
    ],
    summary: {
      overview:
        "This comprehensive React.js course takes you from a complete beginner to building real-world applications. You'll learn the fundamental concepts, best practices, and modern React patterns used in professional development.",
      whatYouLearned: [
        "Understanding React's component-based architecture and its benefits",
        "Setting up a modern React development environment with Create React App",
        "Writing JSX and creating reusable components",
        "Managing component state and passing data through props",
        "Handling user interactions and events effectively",
        "Using React Hooks for state management and side effects",
        "Implementing advanced state management patterns",
        "Building and deploying a complete React application",
      ],
      skillsGained: [
        "Frontend Development with React.js",
        "Component-Based Architecture",
        "State Management",
        "Event Handling",
        "Modern JavaScript (ES6+)",
        "JSX Syntax",
        "React Hooks",
        "Application Deployment",
      ],
      nextSteps: [
        "Learn React Router for single-page applications",
        "Explore state management libraries like Redux or Zustand",
        "Study React testing with Jest and React Testing Library",
        "Build more complex projects with APIs and databases",
        "Learn Next.js for full-stack React development",
      ],
    },
    keyPoints: [
      {
        category: "Core Concepts",
        points: [
          "React is a JavaScript library for building user interfaces",
          "Components are the building blocks of React applications",
          "JSX allows you to write HTML-like syntax in JavaScript",
          "Virtual DOM optimizes performance by minimizing direct DOM manipulation",
        ],
      },
      {
        category: "Data Management",
        points: [
          "Props are used to pass data from parent to child components",
          "State manages dynamic data within components",
          "Props are read-only while state is mutable",
          "State updates trigger component re-renders",
        ],
      },
      {
        category: "Modern React",
        points: [
          "Hooks provide a way to use state and lifecycle methods in functional components",
          "useState hook manages local component state",
          "useEffect hook handles side effects and lifecycle events",
          "Custom hooks allow you to reuse stateful logic",
        ],
      },
      {
        category: "Best Practices",
        points: [
          "Keep components small and focused on a single responsibility",
          "Use meaningful names for components and props",
          "Avoid direct state mutation, always create new objects/arrays",
          "Use React Developer Tools for debugging and optimization",
        ],
      },
    ],
  }

  const progress = Math.round(
    ((completedLessons.length + completedQuizzes.length) / (course.totalLessons + course.totalQuizzes)) * 100,
  )

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const handleQuizComplete = (quizId: number) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes([...completedQuizzes, quizId])
    }
    setSelectedQuiz(null)
  }

  // Simulate scroll-based lesson completion
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollPosition >= documentHeight - 100 && selectedLesson && !completedLessons.includes(selectedLesson)) {
        handleLessonComplete(selectedLesson)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [selectedLesson, completedLessons])

  const renderLessonContent = (lessonId: number) => {
    const lessonContent = {
      1: {
        title: "What is React?",
        content: `
          <h2>Introduction to React</h2>
          <p>React is a powerful JavaScript library developed by Facebook for building user interfaces, particularly web applications. It's designed to make the process of building interactive UIs more efficient and enjoyable.</p>
          
          <h3>Key Features of React</h3>
          <ul>
            <li><strong>Component-Based Architecture:</strong> React applications are built using components, which are reusable pieces of code that manage their own state.</li>
            <li><strong>Virtual DOM:</strong> React uses a virtual representation of the DOM to optimize performance by minimizing direct DOM manipulation.</li>
            <li><strong>Declarative Programming:</strong> You describe what the UI should look like for any given state, and React handles the updates.</li>
            <li><strong>Learn Once, Write Anywhere:</strong> React can be used for web applications, mobile apps (React Native), and even desktop applications.</li>
          </ul>

          <h3>Why Choose React?</h3>
          <p>React has become one of the most popular frontend libraries because of its:</p>
          <ul>
            <li>Strong community support and extensive ecosystem</li>
            <li>Excellent developer tools and debugging capabilities</li>
            <li>Flexibility and scalability for projects of any size</li>
            <li>Strong backing from Meta (Facebook) and continuous development</li>
          </ul>

          <h3>React vs Other Frameworks</h3>
          <p>While there are other popular frameworks like Vue.js and Angular, React stands out for its simplicity, flexibility, and the vast job market opportunities it provides.</p>

          <p>In the next lesson, we'll set up our development environment and create our first React application!</p>
        `,
      },
      2: {
        title: "Setting up Development Environment",
        content: `
          <h2>Setting up Your React Development Environment</h2>
          <p>Before we start building React applications, we need to set up our development environment properly.</p>
          
          <h3>Prerequisites</h3>
          <ul>
            <li><strong>Node.js:</strong> Download and install the latest LTS version from nodejs.org</li>
            <li><strong>Code Editor:</strong> We recommend Visual Studio Code with React extensions</li>
            <li><strong>Browser:</strong> Chrome or Firefox with React Developer Tools extension</li>
          </ul>

          <h3>Creating Your First React App</h3>
          <p>The easiest way to start a React project is using Create React App:</p>
          <pre><code>npx create-react-app my-first-app
cd my-first-app
npm start</code></pre>

          <h3>Project Structure</h3>
          <p>Once created, your project will have this structure:</p>
          <ul>
            <li><code>public/</code> - Static files including index.html</li>
            <li><code>src/</code> - Your React components and application code</li>
            <li><code>package.json</code> - Project dependencies and scripts</li>
          </ul>

          <h3>Essential VS Code Extensions</h3>
          <ul>
            <li>ES7+ React/Redux/React-Native snippets</li>
            <li>Bracket Pair Colorizer</li>
            <li>Auto Rename Tag</li>
            <li>Prettier - Code formatter</li>
          </ul>

          <p>With your environment set up, you're ready to start building React applications!</p>
        `,
      },
      // Add more lesson content as needed
    }

    return (
      lessonContent[lessonId as keyof typeof lessonContent] || {
        title: `Lesson ${lessonId}`,
        content: `<h2>Lesson ${lessonId} Content</h2><p>This is the content for lesson ${lessonId}. In a real application, this would be dynamically generated based on the course topic.</p>`,
      }
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Tutorly</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <History className="mr-2 h-4 w-4" />
                  All Courses
                </Button>
              </Link>
              <ThemeToggle />
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lessons Section */}
                <Collapsible open={lessonsOpen} onOpenChange={setLessonsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <span className="font-medium">Lessons ({course.totalLessons})</span>
                      {lessonsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {course.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant={selectedLesson === lesson.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => {
                          setSelectedLesson(lesson.id)
                          setSelectedQuiz(null)
                          setShowSummary(false)
                          setShowKeyPoints(false)
                          setShowAnalytics(false)
                        }}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {completedLessons.includes(lesson.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Quizzes Section */}
                <Collapsible open={quizzesOpen} onOpenChange={setQuizzesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <span className="font-medium">Quizzes ({course.totalQuizzes})</span>
                      {quizzesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {course.lessons.map((lesson) => (
                      <Button
                        key={`quiz-${lesson.id}`}
                        variant={selectedQuiz === lesson.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => {
                          setSelectedQuiz(lesson.id)
                          setSelectedLesson(0)
                          setShowSummary(false)
                          setShowKeyPoints(false)
                          setShowAnalytics(false)
                        }}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {completedQuizzes.includes(lesson.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Lesson {lesson.id} Quiz</p>
                            <p className="text-xs text-muted-foreground">5 questions</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Summary Section */}
                <Button
                  variant={showSummary ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setShowSummary(true)
                    setShowKeyPoints(false)
                    setShowAnalytics(false)
                    setSelectedLesson(0)
                    setSelectedQuiz(null)
                  }}
                >
                  <Target className="mr-3 h-5 w-5" />
                  Course Summary
                </Button>

                {/* Key Points Section */}
                <Button
                  variant={showKeyPoints ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setShowKeyPoints(true)
                    setShowSummary(false)
                    setShowAnalytics(false)
                    setSelectedLesson(0)
                    setSelectedQuiz(null)
                  }}
                >
                  <CheckCircle className="mr-3 h-5 w-5" />
                  Key Points
                </Button>

                {/* Analytics Section */}
                <Button
                  variant={showAnalytics ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setShowAnalytics(true)
                    setShowSummary(false)
                    setShowKeyPoints(false)
                    setSelectedLesson(0)
                    setSelectedQuiz(null)
                  }}
                >
                  <BarChart className="mr-3 h-5 w-5" />
                  Analytics
                </Button>

                {/* Course Completion Section */}
                {checkCourseCompletion() && !courseCompleted && (
                  <>
                    <Separator />
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setCourseCompleted(true)}>
                      <Trophy className="mr-3 h-5 w-5" />
                      Complete Course
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {selectedLesson > 0 && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{renderLessonContent(selectedLesson).title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="secondary">Lesson {selectedLesson}</Badge>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {course.lessons.find((l) => l.id === selectedLesson)?.duration}
                          </span>
                        </div>
                      </div>
                      {completedLessons.includes(selectedLesson) && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderLessonContent(selectedLesson).content,
                      }}
                    />
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedLesson > 1) {
                            setSelectedLesson(selectedLesson - 1)
                          }
                        }}
                        disabled={selectedLesson === 1}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous Lesson
                      </Button>

                      <Button
                        onClick={() => {
                          if (selectedLesson < course.totalLessons) {
                            setSelectedLesson(selectedLesson + 1)
                          }
                        }}
                        disabled={selectedLesson === course.totalLessons}
                      >
                        Next Lesson
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {selectedQuiz && (
                  <QuizComponent lessonId={selectedQuiz} onComplete={() => handleQuizComplete(selectedQuiz)} />
                )}

                {showSummary && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Target className="mr-3 h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-bold">Course Summary</h1>
                        <p className="text-muted-foreground">Overview of what you've learned</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Course Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{course.summary.overview}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>What You Learned</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {course.summary.whatYouLearned.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                          <div className="flex flex-wrap gap-2">
                            {course.summary.skillsGained.map((skill, index) => (
                              <Badge key={index} variant="secondary">
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
                          <ul className="space-y-2">
                            {course.summary.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <ArrowRight className="mr-3 h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {showKeyPoints && (
                  <div>
                    <div className="flex items-center mb-6">
                      <CheckCircle className="mr-3 h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-bold">Key Points</h1>
                        <p className="text-muted-foreground">Important concepts to remember</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {course.keyPoints.map((category, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Badge variant="outline" className="mr-3">
                                {category.category}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {category.points.map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-start">
                                  <div className="mr-3 h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {showAnalytics && (
                  <div>
                    <div className="flex items-center mb-6">
                      <BarChart className="mr-3 h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-bold">Course Analytics</h1>
                        <p className="text-muted-foreground">Your learning performance and insights</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.timeSpent.total}h</div>
                          <p className="text-xs text-muted-foreground">
                            Lessons: {analyticsData.timeSpent.lessons}h | Quizzes: {analyticsData.timeSpent.quizzes}h
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.performance.averageScore}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.performance.passedQuizzes}/{analyticsData.performance.totalQuizzes} quizzes
                            passed
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{analyticsData.performance.grade}</div>
                          <p className="text-xs text-muted-foreground">Based on your performance</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Progress Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Completed", value: completedLessons.length + completedQuizzes.length },
                                  {
                                    name: "Remaining",
                                    value:
                                      course.totalLessons +
                                      course.totalQuizzes -
                                      (completedLessons.length + completedQuizzes.length),
                                  },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell fill="#8884d8" />
                                <Cell fill="#e5e7eb" />
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
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                              data={[
                                { name: "Quiz 1", score: 85 },
                                { name: "Quiz 2", score: 92 },
                                { name: "Quiz 3", score: 78 },
                                { name: "Quiz 4", score: 88 },
                                { name: "Quiz 5", score: 95 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="score" fill="#8884d8" />
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
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={[
                              { day: "Day 1", lessons: 1, quizzes: 0 },
                              { day: "Day 2", lessons: 3, quizzes: 2 },
                              { day: "Day 3", lessons: 5, quizzes: 4 },
                              { day: "Day 4", lessons: 6, quizzes: 5 },
                              { day: "Day 5", lessons: 8, quizzes: 7 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="lessons" stroke="#8884d8" name="Lessons Completed" />
                            <Line type="monotone" dataKey="quizzes" stroke="#82ca9d" name="Quizzes Completed" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {courseCompleted && (
                  <div>
                    <div className="text-center py-12">
                      <Trophy className="mx-auto mb-6 h-24 w-24 text-yellow-500" />
                      <h1 className="text-4xl font-bold mb-4">Congratulations! 🎉</h1>
                      <p className="text-xl text-muted-foreground mb-8">
                        You have successfully completed the entire course!
                      </p>

                      <div className="grid gap-6 md:grid-cols-3 mb-8 max-w-4xl mx-auto">
                        <Card className="text-center">
                          <CardContent className="pt-6">
                            <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Time Invested</h3>
                            <p className="text-2xl font-bold">{analyticsData.timeSpent.total} hours</p>
                          </CardContent>
                        </Card>

                        <Card className="text-center">
                          <CardContent className="pt-6">
                            <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Final Grade</h3>
                            <p className="text-2xl font-bold text-green-600">{analyticsData.performance.grade}</p>
                          </CardContent>
                        </Card>

                        <Card className="text-center">
                          <CardContent className="pt-6">
                            <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Completion Rate</h3>
                            <p className="text-2xl font-bold">100%</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <Button size="lg" className="mr-4">
                          <Award className="mr-2 h-5 w-5" />
                          Download Certificate
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => setShowAnalytics(true)}>
                          View Detailed Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedLesson &&
                  !selectedQuiz &&
                  !showSummary &&
                  !showKeyPoints &&
                  !showAnalytics &&
                  !courseCompleted && (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <h2 className="text-2xl font-bold mb-2">Welcome to your course!</h2>
                      <p className="text-muted-foreground mb-6">
                        Select a lesson from the sidebar to get started with your learning journey.
                      </p>
                      <Button onClick={() => setSelectedLesson(1)}>Start First Lesson</Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
