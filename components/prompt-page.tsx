"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Sparkles, ArrowRight, History } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function PromptPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const recentCourses = [
    {
      id: 1,
      title: "Introduction to React",
      progress: 75,
      lessons: 12,
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      title: "Python for Beginners",
      progress: 45,
      lessons: 20,
      lastAccessed: "1 day ago",
    },
    {
      id: 3,
      title: "Machine Learning Basics",
      progress: 30,
      lessons: 15,
      lastAccessed: "3 days ago",
    },
  ]

  const handleGenerateCourse = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Simulate course generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to course page
    router.push(`/course/new-course?topic=${encodeURIComponent(prompt)}`)
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Recent Courses */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Courses
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <Link key={course.id} href={`/course/${course.id}`}>
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{course.title}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.lessons} lessons</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{course.lastAccessed}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Course Generation */}
          <div className="lg:col-span-3">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Course Generator
                </Badge>
                <h1 className="text-4xl font-bold mb-4">What would you like to learn today?</h1>
                <p className="text-lg text-muted-foreground">
                  Describe any topic and our AI will create a comprehensive course with lessons, quizzes, and progress
                  tracking.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Generate Your Course</CardTitle>
                  <CardDescription>Be specific about what you want to learn for the best results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Textarea
                      placeholder="Example: I want to learn React.js from basics to advanced, including hooks, state management, and building real projects..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleGenerateCourse}
                      disabled={!prompt.trim() || isGenerating}
                      className="flex-1"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Generating Course...
                        </>
                      ) : (
                        <>
                          Generate Course
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Example Prompts */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Learn Python programming from scratch",
                        "Digital marketing strategies for beginners",
                        "Introduction to machine learning",
                        "Web development with HTML, CSS, and JavaScript",
                      ].map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt(example)}
                          className="text-xs"
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Preview */}
              <div className="grid gap-4 mt-8 sm:grid-cols-3">
                <Card className="text-center p-4">
                  <BookOpen className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h3 className="font-medium">Structured Lessons</h3>
                  <p className="text-sm text-muted-foreground">Well-organized content with clear progression</p>
                </Card>
                <Card className="text-center p-4">
                  <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h3 className="font-medium">Interactive Quizzes</h3>
                  <p className="text-sm text-muted-foreground">Test your knowledge with various question types</p>
                </Card>
                <Card className="text-center p-4">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h3 className="font-medium">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your learning journey step by step</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
