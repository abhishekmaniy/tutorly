"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import { PracticeHub } from "./practice-hub"
import { SocialHub } from "./social-hub"
import { AnalyticsHub } from "./analytics-hub"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learning Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track your progress and enhance your learning journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Practice
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
                    Start New Course
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Take Practice Quiz
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Join Study Group
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Tutor Chat
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

          <TabsContent value="practice">
            <PracticeHub />
          </TabsContent>

          <TabsContent value="social">
            <SocialHub />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
