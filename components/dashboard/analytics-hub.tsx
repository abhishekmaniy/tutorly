"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BookOpen,
  Trophy,
  Calendar,
  Download,
  Eye,
  Brain,
  Zap,
  Award,
  Users,
  Star,
  Activity,
  BarChart3,
} from "lucide-react"

export function AnalyticsHub() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("all")

  // Sample data for charts
  const studyTimeData = [
    { date: "2024-01-01", hours: 2.5, efficiency: 85 },
    { date: "2024-01-02", hours: 3.2, efficiency: 78 },
    { date: "2024-01-03", hours: 1.8, efficiency: 92 },
    { date: "2024-01-04", hours: 4.1, efficiency: 88 },
    { date: "2024-01-05", hours: 2.9, efficiency: 91 },
    { date: "2024-01-06", hours: 3.7, efficiency: 83 },
    { date: "2024-01-07", hours: 2.3, efficiency: 89 },
  ]

  const subjectPerformance = [
    { subject: "JavaScript", score: 92, progress: 85, timeSpent: 45 },
    { subject: "React", score: 88, progress: 72, timeSpent: 38 },
    { subject: "Python", score: 85, progress: 60, timeSpent: 32 },
    { subject: "CSS", score: 91, progress: 78, timeSpent: 28 },
    { subject: "Node.js", score: 79, progress: 45, timeSpent: 22 },
  ]

  const weeklyPattern = [
    { day: "Mon", morning: 2, afternoon: 3, evening: 1 },
    { day: "Tue", morning: 1, afternoon: 4, evening: 2 },
    { day: "Wed", morning: 3, afternoon: 2, evening: 3 },
    { day: "Thu", morning: 2, afternoon: 3, evening: 2 },
    { day: "Fri", morning: 1, afternoon: 2, evening: 4 },
    { day: "Sat", morning: 4, afternoon: 3, evening: 2 },
    { day: "Sun", morning: 3, afternoon: 2, evening: 1 },
  ]

  const learningEfficiency = [
    { month: "Jan", efficiency: 78, retention: 85 },
    { month: "Feb", efficiency: 82, retention: 88 },
    { month: "Mar", efficiency: 85, retention: 90 },
    { month: "Apr", efficiency: 88, retention: 87 },
    { month: "May", efficiency: 91, retention: 92 },
    { month: "Jun", efficiency: 89, retention: 89 },
  ]

  const studyHabits = [
    { habit: "Focus", value: 85 },
    { habit: "Consistency", value: 78 },
    { habit: "Retention", value: 92 },
    { habit: "Speed", value: 76 },
    { habit: "Accuracy", value: 88 },
    { habit: "Engagement", value: 83 },
  ]

  const goalProgress = [
    { name: "Complete 5 Courses", current: 3, target: 5, color: "#3b82f6" },
    { name: "Study 100 Hours", current: 67, target: 100, color: "#10b981" },
    { name: "Achieve 90% Average", current: 87, target: 90, color: "#f59e0b" },
    { name: "30-Day Streak", current: 15, target: 30, color: "#ef4444" },
  ]

  const keyMetrics = [
    {
      title: "Total Study Time",
      value: "127.5h",
      change: "+12.3h",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Average Score",
      value: "87.2%",
      change: "+3.1%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Courses Completed",
      value: "24",
      change: "+3",
      trend: "up",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Learning Streak",
      value: "15 days",
      change: "Personal best!",
      trend: "up",
      icon: Trophy,
      color: "text-orange-600",
    },
    {
      title: "Quiz Accuracy",
      value: "91.5%",
      change: "+2.3%",
      trend: "up",
      icon: Zap,
      color: "text-pink-600",
    },
    {
      title: "Study Efficiency",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: Brain,
      color: "text-indigo-600",
    },
    {
      title: "Global Rank",
      value: "#127",
      change: "↑23",
      trend: "up",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      title: "Peer Comparison",
      value: "+15%",
      change: "Above average",
      trend: "up",
      icon: Users,
      color: "text-cyan-600",
    },
  ]

  const detailedAnalytics = [
    {
      course: "Advanced React Patterns",
      timeSpent: "12.5h",
      completion: 85,
      lastAccessed: "2 hours ago",
      avgScore: 92,
      difficulty: "Advanced",
      progress: 85,
    },
    {
      course: "JavaScript Algorithms",
      timeSpent: "8.3h",
      completion: 60,
      lastAccessed: "1 day ago",
      avgScore: 88,
      difficulty: "Intermediate",
      progress: 60,
    },
    {
      course: "CSS Grid & Flexbox",
      timeSpent: "6.7h",
      completion: 100,
      lastAccessed: "3 days ago",
      avgScore: 95,
      difficulty: "Beginner",
      progress: 100,
    },
    {
      course: "Node.js Fundamentals",
      timeSpent: "15.2h",
      completion: 45,
      lastAccessed: "5 hours ago",
      avgScore: 79,
      difficulty: "Intermediate",
      progress: 45,
    },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analytics Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-400">Deep insights into your learning journey</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <p className="text-xs text-slate-500">{metric.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Study Time Trend
                </CardTitle>
                <CardDescription>Daily study hours over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={studyTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Efficiency
                </CardTitle>
                <CardDescription>Efficiency and retention over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={learningEfficiency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="retention" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Subject Performance
              </CardTitle>
              <CardDescription>Your performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                  <Bar dataKey="progress" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Habits Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Study Habits Analysis
                </CardTitle>
                <CardDescription>Your learning behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={studyHabits}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="habit" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Time Distribution
                </CardTitle>
                <CardDescription>How you spend your study time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectPerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="timeSpent"
                      label={({ subject, timeSpent }) => `${subject}: ${timeSpent}h`}
                    >
                      {subjectPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>Comprehensive breakdown of your learning performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Subject</th>
                      <th className="text-left p-2">Average Score</th>
                      <th className="text-left p-2">Progress</th>
                      <th className="text-left p-2">Time Spent</th>
                      <th className="text-left p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectPerformance.map((subject, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="p-2 font-medium">{subject.subject}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{subject.score}%</span>
                            <Badge
                              variant={
                                subject.score >= 90 ? "default" : subject.score >= 80 ? "secondary" : "destructive"
                              }
                            >
                              {subject.score >= 90 ? "Excellent" : subject.score >= 80 ? "Good" : "Needs Work"}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                        </td>
                        <td className="p-2">{subject.timeSpent}h</td>
                        <td className="p-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Study Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Study Pattern
                </CardTitle>
                <CardDescription>Your study habits throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="morning" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="afternoon" stackId="a" fill="#10b981" />
                    <Bar dataKey="evening" stackId="a" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Velocity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Learning Velocity
                </CardTitle>
                <CardDescription>Speed vs accuracy correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSpent" name="Time Spent" />
                    <YAxis dataKey="score" name="Score" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Subjects" data={subjectPerformance} fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Study Session Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Study Session Quality Analysis</CardTitle>
              <CardDescription>Insights into your most productive study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Morning</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Best for complex topics</div>
                  <div className="text-lg font-semibold mt-2">92% efficiency</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Afternoon</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Great for practice</div>
                  <div className="text-lg font-semibold mt-2">87% efficiency</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">Evening</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Good for review</div>
                  <div className="text-lg font-semibold mt-2">78% efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Progress
                </CardTitle>
                <CardDescription>Track your learning objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goalProgress.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-slate-500">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                    <div className="text-xs text-slate-500">
                      {Math.round((goal.current / goal.target) * 100)}% complete
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievement Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "JavaScript Master", date: "2 days ago", type: "skill" },
                  { title: "7-Day Streak", date: "1 week ago", type: "streak" },
                  { title: "Quiz Champion", date: "2 weeks ago", type: "quiz" },
                  { title: "Course Completed", date: "3 weeks ago", type: "course" },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-slate-500">{achievement.date}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {achievement.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Goal Setting */}
          <Card>
            <CardHeader>
              <CardTitle>Set New Goals</CardTitle>
              <CardDescription>Define your next learning objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Study Hours", icon: Clock, color: "blue" },
                  { title: "Course Completion", icon: BookOpen, color: "green" },
                  { title: "Quiz Scores", icon: Target, color: "purple" },
                  { title: "Streak Days", icon: Trophy, color: "orange" },
                ].map((goalType, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <goalType.icon className={`h-8 w-8 mx-auto mb-2 text-${goalType.color}-600`} />
                      <p className="font-medium">{goalType.title}</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Set Goal
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Course Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
              <CardDescription>Detailed breakdown of your course performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Course</th>
                      <th className="text-left p-3">Time Spent</th>
                      <th className="text-left p-3">Progress</th>
                      <th className="text-left p-3">Avg Score</th>
                      <th className="text-left p-3">Difficulty</th>
                      <th className="text-left p-3">Last Accessed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedAnalytics.map((course, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="p-3">
                          <div className="font-medium">{course.course}</div>
                        </td>
                        <td className="p-3">{course.timeSpent}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-2 w-20" />
                            <span className="text-sm">{course.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={course.avgScore >= 90 ? "default" : "secondary"}>{course.avgScore}%</Badge>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              course.difficulty === "Advanced"
                                ? "border-red-200 text-red-700"
                                : course.difficulty === "Intermediate"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-green-200 text-green-700"
                            }
                          >
                            {course.difficulty}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-slate-500">{course.lastAccessed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "strength",
                  title: "Your Learning Strength",
                  content: "You excel at visual learning and perform 23% better with interactive content.",
                  icon: Star,
                  color: "text-green-600",
                },
                {
                  type: "improvement",
                  title: "Area for Improvement",
                  content: "Consider shorter, more frequent study sessions. Your retention drops after 45 minutes.",
                  icon: TrendingUp,
                  color: "text-blue-600",
                },
                {
                  type: "recommendation",
                  title: "Recommended Focus",
                  content:
                    "Based on your goals, prioritize JavaScript algorithms - you're 67% through and showing strong progress.",
                  icon: Target,
                  color: "text-purple-600",
                },
                {
                  type: "pattern",
                  title: "Learning Pattern",
                  content:
                    "You're most productive on Tuesday mornings with 92% efficiency. Schedule challenging topics then.",
                  icon: Activity,
                  color: "text-orange-600",
                },
              ].map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-full">
                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{insight.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
