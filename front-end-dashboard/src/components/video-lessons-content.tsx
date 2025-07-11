"use client"

import { useState } from "react"
import { Search, Filter, Eye, ThumbsUp, Play, BookOpen, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import PlaceHolder from '../../src/public/placeholder.svg'
// Mock video data
const videoLessons = [
  {
    id: 1,
    title: "Master English Pronunciation: The Complete Guide",
    description:
      "Learn the fundamentals of English pronunciation with step-by-step guidance. Perfect for beginners and intermediate learners.",
    thumbnail: PlaceHolder,
    duration: "15:42",
    views: 125000,
    likes: 8500,
    dislikes: 120,
    uploadDate: "2024-01-15",
    category: "Pronunciation",
    level: "Beginner",
    instructor: "Sarah Johnson",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["pronunciation", "basics", "speaking"],
    rating: 4.8,
    isNew: true,
  },
  {
    id: 2,
    title: "Business English: Professional Meeting Skills",
    description: "Essential phrases and techniques for conducting successful business meetings in English.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "22:18",
    views: 89000,
    likes: 6200,
    dislikes: 85,
    uploadDate: "2024-01-10",
    category: "Business English",
    level: "Intermediate",
    instructor: "Michael Chen",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["business", "meetings", "professional"],
    rating: 4.9,
    isNew: false,
  },
  {
    id: 3,
    title: "IELTS Speaking Test: Band 9 Strategies",
    description: "Proven strategies and techniques to achieve Band 9 in IELTS Speaking test with real examples.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "28:35",
    views: 156000,
    likes: 12000,
    dislikes: 200,
    uploadDate: "2024-01-08",
    category: "IELTS Preparation",
    level: "Advanced",
    instructor: "Emma Williams",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["ielts", "speaking", "test preparation"],
    rating: 4.7,
    isNew: false,
  },
  {
    id: 4,
    title: "Daily Conversation: Small Talk Mastery",
    description: "Learn how to make engaging small talk in any situation. Build confidence in casual conversations.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "18:24",
    views: 67000,
    likes: 4800,
    dislikes: 45,
    uploadDate: "2024-01-12",
    category: "Conversation",
    level: "Beginner",
    instructor: "David Rodriguez",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["conversation", "small talk", "social skills"],
    rating: 4.6,
    isNew: true,
  },
  {
    id: 5,
    title: "Advanced Grammar: Complex Sentence Structures",
    description: "Master complex English grammar patterns and sentence structures for advanced communication.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "31:12",
    views: 43000,
    likes: 3200,
    dislikes: 78,
    uploadDate: "2024-01-05",
    category: "Grammar",
    level: "Advanced",
    instructor: "Lisa Thompson",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["grammar", "advanced", "sentence structure"],
    rating: 4.5,
    isNew: false,
  },
  {
    id: 6,
    title: "Vocabulary Building: 1000 Essential Words",
    description: "Learn the most important English words for everyday communication with memory techniques.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "45:18",
    views: 198000,
    likes: 15000,
    dislikes: 180,
    uploadDate: "2024-01-03",
    category: "Vocabulary",
    level: "Intermediate",
    instructor: "James Park",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["vocabulary", "words", "memory"],
    rating: 4.8,
    isNew: false,
  },
  {
    id: 7,
    title: "American vs British English: Key Differences",
    description:
      "Understand the main differences between American and British English in pronunciation, vocabulary, and grammar.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "19:47",
    views: 112000,
    likes: 7800,
    dislikes: 95,
    uploadDate: "2024-01-14",
    category: "Pronunciation",
    level: "Intermediate",
    instructor: "Rachel Green",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["american", "british", "differences"],
    rating: 4.7,
    isNew: true,
  },
  {
    id: 8,
    title: "Job Interview English: Land Your Dream Job",
    description: "Complete guide to job interviews in English with common questions and perfect answers.",
    thumbnail: "/src/public/placeholder.svg?height=200&width=300",
    duration: "26:33",
    views: 87000,
    likes: 6500,
    dislikes: 110,
    uploadDate: "2024-01-11",
    category: "Business English",
    level: "Intermediate",
    instructor: "Alex Kumar",
    instructorAvatar: "/src/public/placeholder.svg?height=40&width=40",
    tags: ["job interview", "career", "professional"],
    rating: 4.6,
    isNew: false,
  },
]

const categories = [
  "All",
  "Pronunciation",
  "Business English",
  "IELTS Preparation",
  "Conversation",
  "Grammar",
  "Vocabulary",
]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]
const sortOptions = ["Most Recent", "Most Popular", "Highest Rated", "Duration"]

interface VideoLessonsContentProps {
  onVideoSelect: (videoId: number) => void
}

export function VideoLessonsContent({ onVideoSelect }: VideoLessonsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [sortBy, setSortBy] = useState("Most Recent")
  const [activeTab, setActiveTab] = useState("all")

  // Filter and sort videos
  const filteredVideos = videoLessons
    .filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
      const matchesLevel = selectedLevel === "All Levels" || video.level === selectedLevel
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "new" && video.isNew) ||
        (activeTab === "popular" && video.views > 100000) ||
        (activeTab === "trending" && video.rating >= 4.7)

      return matchesSearch && matchesCategory && matchesLevel && matchesTab
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Most Popular":
          return b.views - a.views
        case "Highest Rated":
          return b.rating - a.rating
        case "Duration":
          return Number.parseInt(a.duration.split(":")[0]) - Number.parseInt(b.duration.split(":")[0])
        default: // Most Recent
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      }
    })

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Video Lessons</h1>
        <p className="text-muted-foreground">Learn English with expert-led video lessons</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons, topics, or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-base"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-96">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="new">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              New
            </div>
          </TabsTrigger>
          <TabsTrigger value="popular">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Popular
            </div>
          </TabsTrigger>
          <TabsTrigger value="trending">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredVideos.length} lesson{filteredVideos.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Video Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onVideoSelect(video.id)}
                >
                  <div className="relative">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={video.thumbnail || "/src/public/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>

                      {/* New Badge */}
                      {video.isNew && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white">NEW</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      {/* Title */}
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={video.instructorAvatar || "/src/public/placeholder.svg"}
                          alt={video.instructor}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-muted-foreground">{video.instructor}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(video.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {formatViews(video.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {video.rating}
                        </div>
                      </div>

                      {/* Level and Date */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getLevelColor(video.level)}>
                          {video.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(video.uploadDate)}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedLevel("All Levels")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
