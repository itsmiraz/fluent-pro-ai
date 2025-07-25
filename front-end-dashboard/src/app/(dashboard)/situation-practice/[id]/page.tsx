"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Mic, MicOff, Play, Send, Volume2, RotateCcw, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'

// Mock scenario data - in real app this would come from props/API
const scenarioData = [
  {
    id:1,
    title: "Morning Routine",
    description: "Watch someone's morning routine and describe what they do",
    difficulty: "Beginner",
    videoUrl: "/placeholder.svg?height=400&width=600",
    duration: "2-3 min",
    prompt:
      "Watch this video and describe what the person is doing in their morning routine. Include details about the sequence of activities.",
    keyPoints: ["Sequence of activities", "Time management", "Personal habits", "Preparation steps"],
    expectedElements: [
      "Waking up and getting out of bed",
      "Personal hygiene activities",
      "Getting dressed",
      "Breakfast preparation",
      "Leaving for work/day activities",
    ],
  },
  {
    id:2,
    title: "Cooking Process",
    description: "Observe a cooking demonstration and explain the steps",
    difficulty: "Intermediate",
    videoUrl: "/placeholder.svg?height=400&width=600",
    duration: "4-5 min",
    prompt: "Describe the cooking process you just watched. Explain each step and the ingredients used.",
    keyPoints: ["Ingredient preparation", "Cooking techniques", "Step-by-step process", "Final presentation"],
    expectedElements: [
      "Ingredient selection and preparation",
      "Cooking methods and techniques",
      "Timing and sequence",
      "Plating and presentation",
    ],
  },
  {
    id:3,
    title: "Team Meeting",
    description: "Watch a team meeting and describe the discussion and decisions",
    difficulty: "Advanced",
    videoUrl: "/placeholder.svg?height=400&width=600",
    duration: "5-6 min",
    prompt:
      "Describe what happened in this team meeting. What topics were discussed? What decisions were made? How did team members interact?",
    keyPoints: ["Meeting agenda", "Team dynamics", "Decision-making process", "Communication styles"],
    expectedElements: [
      "Meeting objectives and agenda",
      "Individual contributions",
      "Conflicts or disagreements",
      "Final decisions and action items",
    ],
  },
]

interface SituationPracticeProps {
  scenarioId: number
  onBack: () => void
}

const SituationPractice = () => {
    const params = useParams();
  const scenarioId = params.id;
    const [videoWatched, setVideoWatched] = useState(false)
      const [isPlaying, setIsPlaying] = useState(false)
      const [isRecording, setIsRecording] = useState(false)
      const [recordingTime, setRecordingTime] = useState(0)
      const [textResponse, setTextResponse] = useState("")
      const [inputMode, setInputMode] = useState<"speech" | "text">("text")
      const [feedback, setFeedback] = useState<any>(null)
      const [isAnalyzing, setIsAnalyzing] = useState(false)
    
      const recordingInterval = useRef<NodeJS.Timeout|null>(null)
      const scenario = scenarioData.find((item)=>item.id === Number(scenarioId))
    
      useEffect(() => {
        if (isRecording) {
          recordingInterval.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1)
          }, 1000)
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
        setIsRecording(!isRecording)
        if (!isRecording) {
          setRecordingTime(0)
        }
      }
    
      const playVideo = () => {
        setIsPlaying(true)
        // Simulate video playing
        setTimeout(() => {
          setIsPlaying(false)
          setVideoWatched(true)
        }, 3000) // 3 seconds for demo
      }
    
      const submitResponse = async () => {
        if (!videoWatched) {
          alert("Please watch the video first!")
          return
        }
    
        setIsAnalyzing(true)
    
        // Mock AI analysis - replace with actual API call
        setTimeout(() => {
          const mockFeedback = {
            overallScore: Math.floor(Math.random() * 30) + 70, // 70-100%
            completeness: Math.floor(Math.random() * 25) + 75,
            accuracy: Math.floor(Math.random() + 25) + 75,
            clarity: Math.floor(Math.random() * 25) + 75,
            vocabulary: Math.floor(Math.random() * 25) + 75,
            detailsCovered: Math.floor(Math.random() * (scenario?.expectedElements?.length || 0)) + 2,
            totalDetails: scenario?.expectedElements.length,
            strengths: [
              "Good overall structure in your description",
              "Clear and logical sequence of events",
              "Appropriate use of descriptive language",
            ],
            improvements: [
              "Try to include more specific details about timing",
              "Describe the emotions or reactions of people involved",
              "Use more varied vocabulary to describe actions",
            ],
            missedElements: scenario?.expectedElements.slice(0, Math.floor(Math.random() * 2) + 1),
          }
    
          setFeedback(mockFeedback)
          setIsAnalyzing(false)
        }, 2000)
      }
    
      const resetPractice = () => {
        setVideoWatched(false)
        setIsPlaying(false)
        setFeedback(null)
        setTextResponse("")
        setRecordingTime(0)
        setIsRecording(false)
      }
    
      if (!scenario) {
        return <div>Scenario not found</div>
      }
    
  return (
     <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={'/situations'}>
        <Button variant="outline" size="icon" >
          <ArrowLeft className="h-4 w-4" />
        </Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{scenario.title}</h1>
          <p className="text-muted-foreground">{scenario.description}</p>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {scenario.difficulty}
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Practice Steps</span>
            <span className="text-sm text-muted-foreground">
              Step {videoWatched ? (feedback ? "3" : "2") : "1"} of 3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                videoWatched ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 ${videoWatched ? "bg-green-500" : "bg-muted"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                videoWatched
                  ? feedback
                    ? "bg-green-500 text-white"
                    : "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className={`flex-1 h-1 ${feedback ? "bg-green-500" : "bg-muted"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                feedback ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Watch Video</span>
            <span>Describe Scene</span>
            <span>Get Feedback</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Watch the Situation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src={scenario.videoUrl || "/placeholder.svg"}
                  alt="Scenario video"
                  className="w-full h-full object-cover"
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button size="lg" onClick={playVideo} className="rounded-full h-16 w-16">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </div>
                )}
                {videoWatched && !isPlaying && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white">✓ Watched</Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={playVideo} disabled={isPlaying}>
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? "Playing..." : videoWatched ? "Watch Again" : "Play Video"}
                </Button>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio: ON
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Duration:</strong> {scenario.duration}
                </p>
                <p>
                  <strong>Focus:</strong> Pay attention to details, sequence, and interactions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Points to Watch */}
          <Card>
            <CardHeader>
              <CardTitle>Key Points to Observe</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scenario.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Response Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Describe What You Saw</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium mb-2">Your Task:</p>
                <p className="text-sm">{scenario.prompt}</p>
              </div>

              {!videoWatched && (
                <div className="text-center p-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Please watch the video first before describing it</p>
                </div>
              )}

              {videoWatched && (
                <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as "speech" | "text")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Description</TabsTrigger>
                    <TabsTrigger value="speech">Voice Description</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Describe what you observed in the video. Include details about what happened, who was involved, and the sequence of events..."
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <div className="text-xs text-muted-foreground">
                      {textResponse.length} characters • Aim for at least 100 words for detailed feedback
                    </div>
                  </TabsContent>

                  <TabsContent value="speech" className="space-y-4">
                    <div className="text-center space-y-4">
                      <Button
                        size="lg"
                        className={`h-20 w-20 rounded-full ${
                          isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
                        }`}
                        onClick={toggleRecording}
                      >
                        {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                      </Button>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isRecording ? "Recording... Click to stop" : "Click to start recording your description"}
                        </p>
                        <p className="text-lg font-mono">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                        </p>
                      </div>

                      {isRecording && (
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></div>
                          <div
                            className="h-2 w-2 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {videoWatched && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={submitResponse}
                    disabled={
                      isAnalyzing ||
                      (inputMode === "text" && textResponse.trim().length < 50) ||
                      (inputMode === "speech" && recordingTime === 0)
                    }
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetPractice}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Section */}
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI Analysis Results
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {feedback.overallScore}% Score
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span>{feedback.completeness}%</span>
                    </div>
                    <Progress value={feedback.completeness} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{feedback.accuracy}%</span>
                    </div>
                    <Progress value={feedback.accuracy} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span>{feedback.clarity}%</span>
                    </div>
                    <Progress value={feedback.clarity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vocabulary</span>
                      <span>{feedback.vocabulary}%</span>
                    </div>
                    <Progress value={feedback.vocabulary} className="h-2" />
                  </div>
                </div>

                {/* Details Coverage */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-1">Details Covered</p>
                  <p className="text-2xl font-bold text-primary">
                    {feedback.detailsCovered}/{feedback.totalDetails}
                  </p>
                  <p className="text-xs text-muted-foreground">Key elements mentioned</p>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-medium text-green-600 mb-2">✅ What You Did Well</h4>
                  <ul className="space-y-1">
                    {feedback.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">💡 Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {feedback.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missed Elements */}
                {feedback.missedElements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">🔍 Elements You Could Add</h4>
                    <ul className="space-y-1">
                      {feedback.missedElements.map((element: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {element}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={resetPractice} className="w-full bg-transparent" variant="outline">
                  Try Another Description
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SituationPractice