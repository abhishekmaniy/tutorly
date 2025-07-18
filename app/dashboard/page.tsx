"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Users,
  BarChart3,
  Target,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  MessageSquare,
  Star,
  Brain,
  FileText,
  Timer,
  Zap,
  Play,
  Upload,
  Plus,
  Settings,
  User,
  Bell,
  Share2,
  Heart,
  Send,
  Video,
  Camera,
  Globe,
  Award,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [focusTime, setFocusTime] = useState(25)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [newPost, setNewPost] = useState("")

  const stats = [
    {
      title: "Courses Completed",
      value: "12",
      change: "+2 this week",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Study Hours",
      value: "48.5",
      change: "+5.2 this week",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Quiz Score",
      value: "87%",
      change: "+3% improvement",
      icon: Target,
      color: "text-purple-600",
    },
    {
      title: "Study Streak",
      value: "15 days",
      change: "Personal best!",
      icon: Trophy,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      type: "course",
      title: "Completed React Fundamentals",
      time: "2 hours ago",
      score: 95,
    },
    {
      type: "quiz",
      title: "JavaScript Quiz - Advanced",
      time: "1 day ago",
      score: 88,
    },
    {
      type: "practice",
      title: "Algorithm Practice Session",
      time: "2 days ago",
      score: 92,
    },
  ]

  const flashcards = [
    {
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces",
    },
    {
      question: "What is JSX?",
      answer: "A syntax extension for JavaScript that looks similar to XML or HTML",
    },
    {
      question: "What are React Hooks?",
      answer: "Functions that let you use state and other React features in functional components",
    },
  ]

  const studyGroups = [
    {
      name: "React Developers",
      members: 1247,
      online: 23,
      topic: "Advanced React Patterns",
      nextSession: "Today, 3:00 PM",
    },
    {
      name: "Algorithm Masters",
      members: 892,
      online: 15,
      topic: "Dynamic Programming",
      nextSession: "Tomorrow, 2:00 PM",
    },
    {
      name: "JavaScript Ninjas",
      members: 654,
      online: 8,
      topic: "ES6+ Features",
      nextSession: "Friday, 4:00 PM",
    },
  ]

  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "/placeholder-user.jpg",
      content:
        "Just completed the Advanced React course! The hooks section was particularly challenging but rewarding.",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["React", "JavaScript"],
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      avatar: "/placeholder-user.jpg",
      content: "Hosting a study group for Algorithm Design Patterns this Saturday. Join us!",
      timestamp: "4 hours ago",
      likes: 18,
      comments: 12,
      tags: ["Algorithms", "Study Group"],
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Your comprehensive learning command center</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Focus
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest learning achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            activity.type === "course"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "quiz"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {activity.type === "course" ? (
                            <BookOpen className="h-4 w-4" />
                          ) : activity.type === "quiz" ? (
                            <Target className="h-4 w-4" />
                          ) : (
                            <Trophy className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump into your learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate Course
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Study Companion
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Quiz Generator
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Timer className="h-4 w-4 mr-2" />
                    Focus Timer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "JavaScript", progress: 85, color: "bg-yellow-500" },
                    { subject: "React", progress: 72, color: "bg-blue-500" },
                    { subject: "Node.js", progress: 60, color: "bg-green-500" },
                    { subject: "Python", progress: 45, color: "bg-purple-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.subject}</span>
                        <span className="text-slate-500">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Course Generator */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    AI Course Generator
                  </CardTitle>
                  <CardDescription>Create personalized courses on any topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea placeholder="Enter a topic you want to learn about..." className="min-h-[100px]" />
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Course
                  </Button>
                </CardContent>
              </Card>

              {/* AI Study Companion */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    AI Study Companion
                  </CardTitle>
                  <CardDescription>Get instant help and explanations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ask me anything about your studies!</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              {/* PDF Quiz Generator */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    PDF Quiz Generator
                  </CardTitle>
                  <CardDescription>Generate quizzes from your documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-500">Drop your PDF here or click to upload</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Play className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Focus Timer Tab */}
          <TabsContent value="focus" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pomodoro Timer */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-red-600" />
                    Focus Timer (Pomodoro)
                  </CardTitle>
                  <CardDescription>Stay focused with timed study sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-red-600 mb-4">{formatTime(focusTime * 60)}</div>
                    <div className="flex justify-center gap-2 mb-6">
                      <Button
                        variant={focusTime === 25 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFocusTime(25)}
                      >
                        25 min
                      </Button>
                      <Button
                        variant={focusTime === 15 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFocusTime(15)}
                      >
                        15 min
                      </Button>
                      <Button
                        variant={focusTime === 5 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFocusTime(5)}
                      >
                        5 min
                      </Button>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                      {isTimerRunning ? "Pause" : "Start"} Timer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Focus Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Focus Statistics</CardTitle>
                  <CardDescription>Your focus session analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Sessions Today</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">6.5h</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Focus Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Focus Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">7</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flashcard Viewer */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Smart Flashcards
                  </CardTitle>
                  <CardDescription>
                    Card {currentFlashcard + 1} of {flashcards.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg text-center min-h-[200px] flex items-center justify-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Question</h3>
                      <p className="text-lg">{flashcards[currentFlashcard]?.question}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentFlashcard(Math.max(0, currentFlashcard - 1))}
                      disabled={currentFlashcard === 0}
                    >
                      Previous
                    </Button>
                    <Button variant="outline">Flip Card</Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1))}
                      disabled={currentFlashcard === flashcards.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Flashcard Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Flashcard Sets</CardTitle>
                  <CardDescription>Manage your study cards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "React Fundamentals", cards: 25, mastered: 18 },
                    { name: "JavaScript ES6+", cards: 32, mastered: 24 },
                    { name: "CSS Grid & Flexbox", cards: 15, mastered: 15 },
                    { name: "Node.js Basics", cards: 28, mastered: 12 },
                  ].map((set, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{set.name}</h4>
                        <Badge variant="secondary">
                          {set.mastered}/{set.cards}
                        </Badge>
                      </div>
                      <Progress value={(set.mastered / set.cards) * 100} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">
                        {Math.round((set.mastered / set.cards) * 100)}% mastered
                      </p>
                    </div>
                  ))}
                  <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Set
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Social Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle>Share with the community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What are you learning today?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                      </div>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{post.author}</p>
                            <p className="text-sm text-slate-500">{post.timestamp}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-700 dark:text-slate-300">{post.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Study Groups Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Study Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {studyGroups.map((group, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{group.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {group.online} online
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{group.topic}</p>
                        <p className="text-xs text-slate-500 mb-3">{group.nextSession}</p>
                        <Button size="sm" className="w-full">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    ))}
                    <Button className="w-full bg-transparent" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                  </CardContent>
                </Card>

                {/* Online Friends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Online Friends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Alex Johnson", status: "Studying React", online: true },
                      { name: "Maria Garcia", status: "Taking a quiz", online: true },
                      { name: "David Kim", status: "In focus mode", online: true },
                    ].map((friend, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {friend.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-slate-500">{friend.status}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Study Time", value: "127.5h", change: "+12.3h", icon: Clock, color: "text-blue-600" },
                { title: "Average Score", value: "87.2%", change: "+3.1%", icon: Target, color: "text-green-600" },
                { title: "Courses Completed", value: "24", change: "+3", icon: BookOpen, color: "text-purple-600" },
                { title: "Global Rank", value: "#127", change: "↑23", icon: Award, color: "text-orange-600" },
              ].map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <p className="text-xs text-slate-500">{metric.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts and detailed analytics would go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Study Time Trend</CardTitle>
                  <CardDescription>Your daily study hours over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Your performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { subject: "JavaScript", score: 92, progress: 85 },
                      { subject: "React", score: 88, progress: 72 },
                      { subject: "Python", score: 85, progress: 60 },
                      { subject: "CSS", score: 91, progress: 78 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.subject}</span>
                          <span className="text-slate-500">{item.score}% avg</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
