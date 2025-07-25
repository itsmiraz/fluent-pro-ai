"use client"

import { useState } from "react"
import { Search, Filter, Eye, ThumbsUp, Play, BookOpen, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  return (
  <div></div>
  )
}
