"use client"

import { useState, useRef, useEffect } from "react"
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Zap,
  Crown,
  Medal,
  Target,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Tongue twisters by difficulty
const tongueTwisters = {
  easy: [
    {
      id: 1,
      text: "She sells seashells by the seashore",
      focus: "S sounds",
      tip: "Focus on the 'sh' and 's' sounds. Keep your tongue relaxed.",
      record: { time: 2.8, holder: "Emma K." },
    },
    {
      id: 2,
      text: "Red leather, yellow leather",
      focus: "L and R sounds",
      tip: "Alternate between 'red' and 'yellow' clearly. Don't rush.",
      record: { time: 2.1, holder: "Mike R." },
    },
    {
      id: 3,
      text: "Toy boat, toy boat, toy boat",
      focus: "OY sound",
      tip: "Keep the 'oy' sound consistent. Don't let it become 'oi'.",
      record: { time: 1.9, holder: "Sarah L." },
    },
    {
      id: 4,
      text: "Unique New York, unique New York",
      focus: "N and Y sounds",
      tip: "Emphasize the 'n' in 'unique' and the 'y' in 'York'.",
      record: { time: 2.5, holder: "David M." },
    },
  ],
  medium: [
    {
      id: 5,
      text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
      focus: "W and CH sounds",
      tip: "Break it into sections: 'How much wood' - 'would a woodchuck chuck'.",
      record: { time: 4.2, holder: "Lisa P." },
    },
    {
      id: 6,
      text: "Peter Piper picked a peck of pickled peppers",
      focus: "P sounds",
      tip: "Don't over-aspirate the 'p' sounds. Keep them crisp but not explosive.",
      record: { time: 3.8, holder: "Tom W." },
    },
    {
      id: 7,
      text: "Betty Botter bought some butter, but she said the butter's bitter",
      focus: "B and T sounds",
      tip: "Distinguish between 'Betty', 'Botter', 'bought', and 'butter'.",
      record: { time: 4.1, holder: "Anna C." },
    },
    {
      id: 8,
      text: "Six sick slick slim sycamore saplings",
      focus: "S and L sounds",
      tip: "Each 's' should be clear. Don't let them blend together.",
      record: { time: 3.2, holder: "Chris B." },
    },
  ],
  advanced: [
    {
      id: 9,
      text: "The sixth sick sheik's sixth sheep's sick",
      focus: "TH, S, and SH sounds",
      tip: "This is one of the hardest! Focus on 'sixth' vs 'sick' vs 'sheik's'.",
      record: { time: 2.9, holder: "Alex J." },
    },
    {
      id: 10,
      text: "Pad kid poured curd pulled cod",
      focus: "P, K, and D sounds",
      tip: "Scientists say this is the hardest tongue twister. Take your time!",
      record: { time: 2.1, holder: "Maya S." },
    },
    {
      id: 11,
      text: "Irish wristwatch, Swiss wristwatch",
      focus: "R, S, and W sounds",
      tip: "The 'wr' combination is tricky. Practice 'wrist' separately first.",
      record: { time: 2.7, holder: "Ryan K." },
    },
    {
      id: 12,
      text: "Brisk brave brigadiers brandished broad bright blades",
      focus: "BR and BL sounds",
      tip: "Each 'br' and 'bl' should be distinct. Don't rush the consonant clusters.",
      record: { time: 3.5, holder: "Sophie T." },
    },
  ],
}

// Leaderboard data
const leaderboardData = [
  {
    rank: 1,
    name: "Maya S.",
    avatar: "/placeholder.svg?height=40&width=40",
    bestTime: 2.1,
    twister: "Pad kid poured curd pulled cod",
    difficulty: "Advanced",
    accuracy: 98,
    streak: 15,
  },
  {
    rank: 2,
    name: "Tom W.",
    avatar: "/placeholder.svg?height=40&width=40",
    bestTime: 2.5,
    twister: "Unique New York",
    difficulty: "Easy",
    accuracy: 97,
    streak: 12,
  },
  {
    rank: 3,
    name: "Alex J.",
    avatar: "/placeholder.svg?height=40&width=40",
    bestTime: 2.9,
    twister: "The sixth sick sheik's sixth sheep's sick",
    difficulty: "Advanced",
    accuracy: 95,
    streak: 8,
  },
  {
    rank: 4,
    name: "Sarah L.",
    avatar: "/placeholder.svg?height=40&width=40",
    bestTime: 1.9,
    twister: "Toy boat, toy boat, toy boat",
    difficulty: "Easy",
    accuracy: 99,
    streak: 22,
  },
  {
    rank: 5,
    name: "Chris B.",
    avatar: "/placeholder.svg?height=40&width=40",
    bestTime: 3.2,
    twister: "Six sick slick slim sycamore saplings",
    difficulty: "Medium",
    accuracy: 94,
    streak: 6,
  },
]

// Today's featured twister (changes daily)
const getTodaysTwister = () => {
  const allTwisters = [...tongueTwisters.easy, ...tongueTwisters.medium, ...tongueTwisters.advanced]
  const today = new Date().getDate()
  return allTwisters[today % allTwisters.length]
}

export function PronunciationContent() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "advanced">("easy")
  const [currentTwister, setCurrentTwister] = useState(tongueTwisters.easy[0])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [personalBest, setPersonalBest] = useState<number | null>(null)

  const recordingInterval = useRef<NodeJS.Timeout>()
  const todaysTwister = getTodaysTwister()

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 0.1)
      }, 100)
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }, [isRecording])

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and analyze
      setIsRecording(false)
      analyzePronunciation()
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingTime(0)
      setFeedback(null)
    }
  }

  const analyzePronunciation = () => {
    setIsAnalyzing(true)

    // Mock AI analysis
    setTimeout(() => {
      const mockFeedback = {
        accuracy: Math.floor(Math.random() * 20) + 80, // 80-100%
        clarity: Math.floor(Math.random() * 25) + 75,
        speed: Math.floor(Math.random() * 30) + 70,
        time: recordingTime,
        isPersonalBest: personalBest === null || recordingTime < personalBest,
        improvements: [
          "Try to enunciate the 's' sounds more clearly",
          "Slow down slightly for better clarity",
          "Great rhythm and flow!",
        ],
        strengths: ["Excellent consonant pronunciation", "Good pacing overall", "Clear vowel sounds"],
      }

      if (mockFeedback.isPersonalBest) {
        setPersonalBest(recordingTime)
      }

      setFeedback(mockFeedback)
      setIsAnalyzing(false)
    }, 2000)
  }

  const playAudio = () => {
    setIsPlaying(true)
    // Mock audio playback
    setTimeout(() => {
      setIsPlaying(false)
    }, 2000)
  }

  const resetPractice = () => {
    setRecordingTime(0)
    setFeedback(null)
    setIsRecording(false)
  }

  const selectTwister = (twister: any) => {
    setCurrentTwister(twister)
    resetPractice()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
      case 3:
        return <Medal className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold">#{rank}</span>
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-bold">Pronunciation Practice</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Master English pronunciation with tongue twisters and AI feedback
        </p>
      </div>

      {/* Today's Featured Twister */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg md:text-xl">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <span className="text-base md:text-lg">🌀 Today's Twister Challenge</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs w-fit"
            >
              Featured
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold mb-2 px-2">"{todaysTwister.text}"</p>
            <Badge
              className={getDifficultyColor(
                selectedDifficulty === "easy" ? "Easy" : selectedDifficulty === "medium" ? "Medium" : "Advanced",
              )}
            >
              Focus: {todaysTwister.focus}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Button
              variant="outline"
              onClick={playAudio}
              disabled={isPlaying}
              className="w-full sm:w-auto bg-transparent"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
            <Button onClick={() => selectTwister(todaysTwister)} className="w-full sm:w-auto">
              <Target className="h-4 w-4 mr-2" />
              Practice This
            </Button>
          </div>

          <div className="text-center text-xs md:text-sm text-muted-foreground">
            <p>
              🏆 Current Record: {todaysTwister.record.time}s by {todaysTwister.record.holder}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9 md:h-10">
          <TabsTrigger value="practice" className="text-xs md:text-sm">
            Practice
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs md:text-sm">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs md:text-sm">
            My Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Practice Interface */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Practice Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Twister Display */}
                  <div className="text-center p-4 md:p-6 rounded-lg bg-muted/30 border-2 border-dashed">
                    <p className="text-base md:text-lg font-semibold mb-2 px-2">"{currentTwister.text}"</p>
                    <Badge variant="outline" className="mb-2 text-xs">
                      Focus: {currentTwister.focus}
                    </Badge>
                    <p className="text-xs md:text-sm text-muted-foreground italic px-2">💡 {currentTwister.tip}</p>
                  </div>

                  {/* Recording Interface */}
                  <div className="text-center space-y-4">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={playAudio}
                        disabled={isPlaying}
                        className="w-full sm:w-auto bg-transparent"
                      >
                        {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        Listen
                      </Button>
                      <Button variant="outline" onClick={resetPractice} className="w-full sm:w-auto bg-transparent">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    <Button
                      size="lg"
                      className={`h-16 w-16 md:h-20 md:w-20 rounded-full ${
                        isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
                      }`}
                      onClick={toggleRecording}
                      disabled={isAnalyzing}
                    >
                      {isRecording ? (
                        <MicOff className="h-6 w-6 md:h-8 md:w-8" />
                      ) : (
                        <Mic className="h-6 w-6 md:h-8 md:w-8" />
                      )}
                    </Button>

                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                      </p>
                      <p className="text-xl md:text-2xl font-mono font-bold">{recordingTime.toFixed(1)}s</p>
                      {personalBest && (
                        <p className="text-xs text-green-600">Personal Best: {personalBest.toFixed(1)}s</p>
                      )}
                    </div>

                    {isAnalyzing && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-xs md:text-sm">Analyzing pronunciation...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card>
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg md:text-xl">
                      <span className="text-base md:text-lg">AI Pronunciation Feedback</span>
                      {feedback.isPersonalBest && (
                        <Badge className="bg-green-500 text-white text-xs w-fit">🎉 New Personal Best!</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                        <p className="text-lg md:text-2xl font-bold text-blue-600">{feedback.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                        <p className="text-lg md:text-2xl font-bold text-green-600">{feedback.clarity}%</p>
                        <p className="text-xs text-muted-foreground">Clarity</p>
                      </div>
                      <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                        <p className="text-lg md:text-2xl font-bold text-purple-600">{feedback.speed}%</p>
                        <p className="text-xs text-muted-foreground">Speed</p>
                      </div>
                    </div>

                    {/* Time Comparison */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs md:text-sm font-medium">Your Time</p>
                          <p className="text-lg md:text-xl font-bold">{feedback.time.toFixed(1)}s</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs md:text-sm font-medium">Record</p>
                          <p className="text-lg md:text-xl font-bold text-yellow-600">{currentTwister.record.time}s</p>
                        </div>
                      </div>
                      <Progress
                        value={Math.min((currentTwister.record.time / feedback.time) * 100, 100)}
                        className="h-2 mt-2"
                      />
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2 text-sm md:text-base">✅ Strengths</h4>
                        <ul className="space-y-1">
                          {feedback.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-xs md:text-sm text-muted-foreground">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2 text-sm md:text-base">💡 Improvements</h4>
                        <ul className="space-y-1">
                          {feedback.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="text-xs md:text-sm text-muted-foreground">
                              • {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Twister Selection */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-lg md:text-xl">Choose Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 md:gap-2 mb-4">
                    {(["easy", "medium", "advanced"] as const).map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className="flex-1 text-xs md:text-sm px-2 md:px-3"
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-80 md:max-h-96 overflow-y-auto">
                    {tongueTwisters[selectedDifficulty].map((twister) => (
                      <div
                        key={twister.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                          currentTwister.id === twister.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => selectTwister(twister)}
                      >
                        <p className="font-medium text-xs md:text-sm mb-1 leading-relaxed">"{twister.text}"</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {twister.focus}
                          </Badge>
                          <div className="text-xs text-muted-foreground">🏆 {twister.record.time}s</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg md:text-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  <span className="text-base md:text-lg">Global Leaderboard</span>
                </div>
                <Badge variant="secondary" className="text-xs w-fit">
                  Top Performers
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {leaderboardData.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-lg border ${
                      player.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-center w-6 md:w-8">{getRankIcon(player.rank)}</div>

                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={player.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base">{player.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">"{player.twister}"</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm md:text-lg">{player.bestTime}s</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className={`${getDifficultyColor(player.difficulty)} text-xs`}>
                          {player.difficulty}
                        </Badge>
                        <span className="hidden sm:inline">{player.accuracy}% accuracy</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                        <span className="font-bold text-xs md:text-sm">{player.streak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Personal Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                    <p className="text-lg md:text-2xl font-bold text-blue-600">47</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Twisters Mastered</p>
                  </div>
                  <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                    <p className="text-lg md:text-2xl font-bold text-green-600">89%</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Avg Accuracy</p>
                  </div>
                  <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                    <p className="text-lg md:text-2xl font-bold text-purple-600">2.3s</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Best Time</p>
                  </div>
                  <div className="text-center p-2 md:p-3 rounded-lg bg-muted/30">
                    <p className="text-lg md:text-2xl font-bold text-orange-600">12</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Difficulty Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span>Easy Twisters</span>
                      <span>4/4 (100%)</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span>Medium Twisters</span>
                      <span>3/4 (75%)</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span>Advanced Twisters</span>
                      <span>1/4 (25%)</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Speed Demon</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Completed a twister in under 2 seconds</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Today
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Perfect Week</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Practiced pronunciation 7 days in a row</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    2 days ago
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <Medal className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Accuracy Master</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Achieved 95%+ accuracy on 10 twisters</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    1 week ago
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
