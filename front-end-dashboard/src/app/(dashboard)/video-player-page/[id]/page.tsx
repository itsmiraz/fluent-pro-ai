"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  BookmarkPlus,
  MoreVertical,
  Clock,
  Eye,
  Star,
  Send,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Link from "next/link";
import PlaceHolder from '../../../../../src/public/placeholder.svg'

// Mock video data (same as in video-lessons-content.tsx)
const videoLessons = [
  {
    id: 1,
    title: "Master English Pronunciation: The Complete Guide",
    description:
      "Learn the fundamentals of English pronunciation with step-by-step guidance. Perfect for beginners and intermediate learners. In this comprehensive lesson, we'll cover the International Phonetic Alphabet (IPA), common pronunciation mistakes, and practical exercises to improve your speaking skills. You'll learn how to position your tongue, lips, and jaw correctly for each sound, and practice with real-world examples.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    videoUrl: "/placeholder.svg?height=400&width=600",
    duration: "15:42",
    views: 125000,
    likes: 8500,
    dislikes: 120,
    uploadDate: "2024-01-15",
    category: "Pronunciation",
    level: "Beginner",
    instructor: "Sarah Johnson",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    instructorBio:
      "Sarah is a certified ESL instructor with 10+ years of experience teaching English pronunciation and phonetics.",
    tags: ["pronunciation", "basics", "speaking"],
    rating: 4.8,
    isNew: true,
    chapters: [
      { title: "Introduction to Pronunciation", time: "0:00" },
      { title: "The IPA System", time: "2:30" },
      { title: "Vowel Sounds", time: "5:15" },
      { title: "Consonant Sounds", time: "8:45" },
      { title: "Practice Exercises", time: "12:20" },
    ],
    transcript:
      "Welcome to this comprehensive guide on English pronunciation. Today we'll be covering the fundamentals that every English learner needs to know...",
  },
  // Add other videos here for related videos section
];

// Mock comments data
const comments = [
  {
    id: 1,
    user: "Alex Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "This is exactly what I needed! The pronunciation tips are so helpful. Thank you Sarah!",
    likes: 45,
    replies: 3,
    timeAgo: "2 days ago",
    isLiked: false,
  },
  {
    id: 2,
    user: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Could you make a video about American vs British pronunciation differences?",
    likes: 23,
    replies: 1,
    timeAgo: "1 week ago",
    isLiked: true,
  },
  {
    id: 3,
    user: "John Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "The IPA section was particularly useful. I've been struggling with those symbols for months!",
    likes: 67,
    replies: 5,
    timeAgo: "3 days ago",
    isLiked: false,
  },
];

// Mock related videos
const relatedVideos = [
  {
    id: 2,
    title: "Business English: Professional Meeting Skills",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "22:18",
    views: 89000,
    instructor: "Michael Chen",
    uploadDate: "2024-01-10",
  },
  {
    id: 3,
    title: "IELTS Speaking Test: Band 9 Strategies",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "28:35",
    views: 156000,
    instructor: "Emma Williams",
    uploadDate: "2024-01-08",
  },
  {
    id: 4,
    title: "Daily Conversation: Small Talk Mastery",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "18:24",
    views: 67000,
    instructor: "David Rodriguez",
    uploadDate: "2024-01-12",
  },
];

interface VideoPlayerPageProps {
  videoId: number;
  onBack: () => void;
  onVideoSelect: (videoId: number) => void;
}
const VideoPlayerPage = ({ onBack }: VideoPlayerPageProps) => {
  const params = useParams();
  const videoId = params.id;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(942); // 15:42 in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsData, setCommentsData] = useState(comments);

  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const video = videoLessons.find((v) => String(v?.id) === videoId) || videoLessons[0];

  useEffect(() => {
    // Simulate video progress
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: commentsData.length + 1,
        user: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        content: newComment,
        likes: 0,
        replies: 0,
        timeAgo: "Just now",
        isLiked: false,
      };
      setCommentsData([comment, ...commentsData]);
      setNewComment("");
    }
  };

  const handleCommentLike = (commentId: number) => {
    setCommentsData((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={"/video-lessons"}>
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <Card className="overflow-hidden">
            <div
              ref={videoRef}
              className={`relative aspect-video bg-black group cursor-pointer ${
                isFullscreen ? "fixed inset-0 z-50" : ""
              }`}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => {
                if (controlsTimeoutRef.current) {
                  clearTimeout(controlsTimeoutRef.current);
                }
                controlsTimeoutRef.current = setTimeout(() => {
                  if (isPlaying) setShowControls(false);
                }, 2000);
              }}
            >
              {/* Video Thumbnail/Player */}
              <img
                src={video.videoUrl || PlaceHolder}
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Play/Pause Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full bg-white/90 hover:bg-white"
                    onClick={togglePlay}
                  >
                    <Play className="h-8 w-8 text-black ml-1" />
                  </Button>
                </div>
              )}

              {/* Video Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div
                  className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Video Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatViews(video.views)} views
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(video.uploadDate).toLocaleDateString()}
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {video.level}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {formatViews(video.likes + (isLiked ? 1 : 0))}
              </Button>

              <Button
                variant={isDisliked ? "default" : "outline"}
                size="sm"
                onClick={handleDislike}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                {formatViews(video.dislikes + (isDisliked ? 1 : 0))}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="gap-2"
              >
                <BookmarkPlus className="h-4 w-4" />
                Save
              </Button>

              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Instructor Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={video.instructorAvatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {video.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{video.instructor}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {video.instructorBio}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {video.rating} rating
                      </div>
                      <span>125K subscribers</span>
                    </div>
                  </div>
                  <Button variant="outline">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Description and Chapters */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">
                      {video.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chapters" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {video.chapters.map((chapter, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => {
                            const [mins, secs] = chapter.time
                              .split(":")
                              .map(Number);
                            setCurrentTime(mins * 60 + secs);
                          }}
                        >
                          <span className="text-sm font-mono text-muted-foreground w-12">
                            {chapter.time}
                          </span>
                          <span className="text-sm">{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">
                      {video.transcript}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Comments ({commentsData.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewComment("")}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCommentSubmit}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {commentsData.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment.user}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timeAgo}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentLike(comment.id)}
                            className={`gap-1 h-8 px-2 ${
                              comment.isLiked ? "text-red-500" : ""
                            }`}
                          >
                            <Heart
                              className={`h-3 w-3 ${
                                comment.isLiked ? "fill-current" : ""
                              }`}
                            />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            Reply
                          </Button>
                          {comment.replies > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground"
                            >
                              View {comment.replies} replies
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Related Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  // onClick={() => onVideoSelect(relatedVideo.id)}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={relatedVideo.thumbnail || "/placeholder.svg"}
                      alt={relatedVideo.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                      {relatedVideo.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {relatedVideo.instructor}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatViews(relatedVideo.views)} views</span>
                      <span>•</span>
                      <span>
                        {new Date(relatedVideo.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Video Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Watched</span>
                  <span>{Math.round((currentTime / duration) * 100)}%</span>
                </div>
                <Progress
                  value={(currentTime / duration) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {formatTime(currentTime)} of {formatTime(duration)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default VideoPlayerPage;
