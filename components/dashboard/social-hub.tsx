"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Calendar,
  Video,
  Send,
  Plus,
  Search,
  UserPlus,
  BookOpen,
  Trophy,
  Globe,
} from "lucide-react"

export function SocialHub() {
  const [newPost, setNewPost] = useState("")
  const [activeChat, setActiveChat] = useState(null)

  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder-user.jpg",
        badge: "Expert",
      },
      content:
        "Just completed the Advanced React course! The hooks section was particularly challenging but rewarding. Anyone else working through this?",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ["React", "JavaScript"],
      type: "achievement",
    },
    {
      id: 2,
      author: {
        name: "Mike Rodriguez",
        avatar: "/placeholder-user.jpg",
        badge: "Mentor",
      },
      content:
        "Hosting a study group for Algorithm Design Patterns this Saturday at 2 PM EST. We'll cover Strategy and Observer patterns. Join us!",
      timestamp: "4 hours ago",
      likes: 18,
      comments: 12,
      shares: 7,
      tags: ["Algorithms", "Study Group"],
      type: "event",
    },
    {
      id: 3,
      author: {
        name: "Emma Wilson",
        avatar: "/placeholder-user.jpg",
        badge: "Student",
      },
      content:
        "Quick tip: When learning CSS Grid, start with the basics and gradually build complexity. Here's a simple layout I created today!",
      timestamp: "6 hours ago",
      likes: 31,
      comments: 5,
      shares: 12,
      tags: ["CSS", "Tips"],
      type: "tip",
      image: "/placeholder.jpg",
    },
  ]

  const studyGroups = [
    {
      id: 1,
      name: "React Developers",
      members: 1247,
      description: "Learn React together with fellow developers",
      category: "JavaScript",
      isJoined: true,
      lastActivity: "2 min ago",
      avatar: "/placeholder.jpg",
    },
    {
      id: 2,
      name: "Algorithm Masters",
      members: 892,
      description: "Solve complex algorithms and data structures",
      category: "Computer Science",
      isJoined: false,
      lastActivity: "1 hour ago",
      avatar: "/placeholder.jpg",
    },
    {
      id: 3,
      name: "UI/UX Design Hub",
      members: 654,
      description: "Design principles and user experience",
      category: "Design",
      isJoined: true,
      lastActivity: "30 min ago",
      avatar: "/placeholder.jpg",
    },
  ]

  const friends = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder-user.jpg",
      status: "online",
      currentActivity: "Studying JavaScript",
      streak: 15,
      lastSeen: "now",
    },
    {
      id: 2,
      name: "Lisa Park",
      avatar: "/placeholder-user.jpg",
      status: "studying",
      currentActivity: "React Course - Lesson 5",
      streak: 8,
      lastSeen: "5 min ago",
    },
    {
      id: 3,
      name: "David Kim",
      avatar: "/placeholder-user.jpg",
      status: "offline",
      currentActivity: "Last seen studying Python",
      streak: 22,
      lastSeen: "2 hours ago",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "JavaScript Fundamentals Workshop",
      date: "Tomorrow, 3:00 PM",
      attendees: 45,
      host: "Sarah Chen",
      type: "workshop",
    },
    {
      id: 2,
      title: "React Study Group",
      date: "Saturday, 2:00 PM",
      attendees: 23,
      host: "Mike Rodriguez",
      type: "study-group",
    },
    {
      id: 3,
      title: "Algorithm Challenge",
      date: "Sunday, 10:00 AM",
      attendees: 67,
      host: "Emma Wilson",
      type: "challenge",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "studying":
        return "bg-blue-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "tip":
        return <BookOpen className="h-4 w-4 text-green-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Social Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-400">Connect, learn, and grow with the community</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
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
                        <BookOpen className="h-4 w-4 mr-2" />
                        Course
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trophy className="h-4 w-4 mr-2" />
                        Achievement
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Event
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{post.author.name}</p>
                              <Badge variant="secondary" className="text-xs">
                                {post.author.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">{post.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">{getPostTypeIcon(post.type)}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-700 dark:text-slate-300">{post.content}</p>

                      {post.image && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

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
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { tag: "React", posts: 234 },
                    { tag: "JavaScript", posts: 189 },
                    { tag: "Python", posts: 156 },
                    { tag: "CSS", posts: 98 },
                    { tag: "Algorithms", posts: 87 },
                  ].map((topic, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <span className="font-medium">#{topic.tag}</span>
                      <span className="text-sm text-slate-500">{topic.posts} posts</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Online Friends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Online Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {friends
                    .filter((f) => f.status === "online" || f.status === "studying")
                    .map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{friend.name}</p>
                          <p className="text-xs text-slate-500 truncate">{friend.currentActivity}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search groups..." className="pl-10" />
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {group.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-slate-500">{group.members} members</p>
                      </div>
                    </div>
                    {group.isJoined && <Badge variant="secondary">Joined</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-400">{group.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{group.category}</Badge>
                    <span className="text-slate-500">Active {group.lastActivity}</span>
                  </div>
                  <Button className="w-full" variant={group.isJoined ? "outline" : "default"}>
                    {group.isJoined ? (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Chat
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Group
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search friends..." className="pl-10" />
              </div>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <Card key={friend.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {friend.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{friend.name}</CardTitle>
                      <p className="text-sm text-slate-500 capitalize">{friend.status}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{friend.currentActivity}</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{friend.streak} day streak</span>
                    </div>
                    <p className="text-xs text-slate-500">Last seen {friend.lastSeen}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Upcoming Events</h3>
              <p className="text-slate-600 dark:text-slate-400">Join study sessions and workshops</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-slate-500">by {event.host}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type.replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
