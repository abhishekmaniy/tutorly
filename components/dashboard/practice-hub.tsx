"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Target,
  Clock,
  Trophy,
  Star,
  Play,
  Users,
  Filter,
  Search,
  Zap,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react"

export function PracticeHub() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const challenges = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JS basics",
      difficulty: "beginner",
      category: "JavaScript",
      points: 100,
      timeLimit: 15,
      attempts: 3,
      bestScore: 85,
      completed: true,
      participants: 1247,
    },
    {
      id: 2,
      title: "React Hooks Deep Dive",
      description: "Advanced React hooks concepts",
      difficulty: "advanced",
      category: "React",
      points: 250,
      timeLimit: 30,
      attempts: 1,
      bestScore: 0,
      completed: false,
      participants: 892,
    },
    {
      id: 3,
      title: "Algorithm Challenge",
      description: "Solve complex algorithms",
      difficulty: "expert",
      category: "Algorithms",
      points: 500,
      timeLimit: 45,
      attempts: 0,
      bestScore: 0,
      completed: false,
      participants: 456,
    },
    {
      id: 4,
      title: "CSS Grid & Flexbox",
      description: "Master modern CSS layouts",
      difficulty: "intermediate",
      category: "CSS",
      points: 150,
      timeLimit: 20,
      attempts: 2,
      bestScore: 92,
      completed: true,
      participants: 1089,
    },
  ]

  const practiceStats = [
    {
      title: "Challenges Completed",
      value: "24",
      change: "+3 this week",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Total Points",
      value: "2,450",
      change: "+350 this week",
      icon: Star,
      color: "text-purple-600",
    },
    {
      title: "Average Score",
      value: "87%",
      change: "+5% improvement",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Global Rank",
      value: "#127",
      change: "↑23 positions",
      icon: Award,
      color: "text-blue-600",
    },
  ]

  const recentSessions = [
    {
      challenge: "JavaScript Fundamentals",
      score: 85,
      time: "12 min",
      date: "2 hours ago",
      status: "completed",
    },
    {
      challenge: "CSS Grid & Flexbox",
      score: 92,
      time: "18 min",
      date: "1 day ago",
      status: "completed",
    },
    {
      challenge: "React Hooks Deep Dive",
      score: 0,
      time: "0 min",
      date: "2 days ago",
      status: "abandoned",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Alex Chen", points: 4250, streak: 15 },
    { rank: 2, name: "Sarah Johnson", points: 3890, streak: 12 },
    { rank: 3, name: "Mike Rodriguez", points: 3654, streak: 8 },
    { rank: 4, name: "Emma Wilson", points: 3201, streak: 22 },
    { rank: 5, name: "You", points: 2450, streak: 7 },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-orange-100 text-orange-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDifficulty && matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Practice Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-400">Challenge yourself and improve your skills</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Zap className="h-4 w-4 mr-2" />
          Quick Challenge
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {practiceStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search challenges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Cards */}
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {challenge.title}
                        {challenge.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Trophy className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {challenge.points} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {challenge.timeLimit} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {challenge.participants} participants
                      </div>
                    </div>

                    {challenge.attempts > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Best Score: {challenge.bestScore}%</span>
                          <span>Attempts: {challenge.attempts}</span>
                        </div>
                        <Progress value={challenge.bestScore} className="h-2" />
                      </div>
                    )}

                    <Button className="w-full" variant={challenge.completed ? "outline" : "default"}>
                      <Play className="h-4 w-4 mr-2" />
                      {challenge.completed ? "Retry Challenge" : "Start Challenge"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{session.challenge}</p>
                    <Badge variant={session.status === "completed" ? "default" : "destructive"} className="text-xs">
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Score: {session.score}%</span>
                    <span>{session.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{session.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top performers this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.name === "You"
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1
                          ? "bg-yellow-500 text-white"
                          : user.rank === 2
                            ? "bg-gray-400 text-white"
                            : user.rank === 3
                              ? "bg-orange-500 text-white"
                              : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.streak} day streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{user.points}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
