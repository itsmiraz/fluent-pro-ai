"use client"

import { useState } from "react"
import { Check, Clock, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TOnboardingData } from "@/redux/feature/onBoarding/onBoardingType"

interface DailyPracticePanelProps {
  onboardingData?: TOnboardingData
}

export function DailyPracticePanel({ onboardingData }: DailyPracticePanelProps = {}) {
  const getPersonalizedTasks = (onboardingData?: TOnboardingData) => {
    if (!onboardingData) {
      return [
        { id: 1, title: "3-Minute Speaking Recording", completed: true, xp: 50 },
        { id: 2, title: "Learn 5 New Words", completed: true, xp: 30 },
        { id: 3, title: "One Situation Practice", completed: false, xp: 40 },
        { id: 4, title: "Watch & Shadow 1 Video", completed: false, xp: 35 },
        { id: 5, title: "Grammar Fix Challenge", completed: false, xp: 25 },
      ]
    }

    const { goal, level } = onboardingData
    const baseXP = level === "beginner" ? 20 : level === "intermediate" ? 30 : 40

    switch (goal.id) {
      case "daily-conversation":
        return [
          { id: 1, title: "Casual Conversation Practice", completed: true, xp: baseXP + 10 },
          { id: 2, title: "Learn 5 Daily Phrases", completed: true, xp: baseXP },
          { id: 3, title: "Small Talk Simulation", completed: false, xp: baseXP + 15 },
          { id: 4, title: "Pronunciation: Common Words", completed: false, xp: baseXP + 5 },
          { id: 5, title: "Listen & Repeat Exercise", completed: false, xp: baseXP },
        ]
      case "professional-corporate":
        return [
          { id: 1, title: "Business Meeting Roleplay", completed: true, xp: baseXP + 20 },
          { id: 2, title: "Corporate Vocabulary", completed: true, xp: baseXP + 10 },
          { id: 3, title: "Email Writing Practice", completed: false, xp: baseXP + 15 },
          { id: 4, title: "Professional Presentation", completed: false, xp: baseXP + 25 },
          { id: 5, title: "Industry Terminology", completed: false, xp: baseXP + 5 },
        ]
      case "sales-client-meetings":
        return [
          { id: 1, title: "Sales Pitch Practice", completed: true, xp: baseXP + 25 },
          { id: 2, title: "Client Objection Handling", completed: true, xp: baseXP + 20 },
          { id: 3, title: "Negotiation Vocabulary", completed: false, xp: baseXP + 15 },
          { id: 4, title: "Product Demo Simulation", completed: false, xp: baseXP + 20 },
          { id: 5, title: "Follow-up Communication", completed: false, xp: baseXP + 10 },
        ]
      case "ielts-academic":
        return [
          { id: 1, title: "IELTS Speaking Task 1", completed: true, xp: baseXP + 15 },
          { id: 2, title: "Academic Vocabulary Set", completed: true, xp: baseXP + 10 },
          { id: 3, title: "Essay Structure Practice", completed: false, xp: baseXP + 20 },
          { id: 4, title: "Listening Comprehension", completed: false, xp: baseXP + 15 },
          { id: 5, title: "Grammar: Complex Sentences", completed: false, xp: baseXP + 10 },
        ]
      case "public-speaking":
        return [
          { id: 1, title: "Presentation Opening", completed: true, xp: baseXP + 20 },
          { id: 2, title: "Voice Projection Exercise", completed: true, xp: baseXP + 15 },
          { id: 3, title: "Storytelling Practice", completed: false, xp: baseXP + 25 },
          { id: 4, title: "Q&A Session Simulation", completed: false, xp: baseXP + 20 },
          { id: 5, title: "Confidence Building", completed: false, xp: baseXP + 10 },
        ]
      case "writing-email":
        return [
          { id: 1, title: "Professional Email Template", completed: true, xp: baseXP + 15 },
          { id: 2, title: "Formal Writing Vocabulary", completed: true, xp: baseXP + 10 },
          { id: 3, title: "Email Tone Practice", completed: false, xp: baseXP + 20 },
          { id: 4, title: "Grammar: Punctuation", completed: false, xp: baseXP + 10 },
          { id: 5, title: "Business Correspondence", completed: false, xp: baseXP + 15 },
        ]
      default:
        return [
          { id: 1, title: "Custom Goal Practice", completed: true, xp: baseXP + 10 },
          { id: 2, title: "Targeted Vocabulary", completed: true, xp: baseXP },
          { id: 3, title: "Specific Skill Building", completed: false, xp: baseXP + 15 },
          { id: 4, title: "Goal-Focused Exercise", completed: false, xp: baseXP + 20 },
          { id: 5, title: "Progress Assessment", completed: false, xp: baseXP + 5 },
        ]
    }
  }

  const dailyTasks = getPersonalizedTasks(onboardingData)
  const [tasks, setTasks] = useState(dailyTasks)
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalXP = tasks.reduce((sum, task) => sum + (task.completed ? task.xp : 0), 0)
  const maxXP = tasks.reduce((sum, task) => sum + task.xp, 0)
  const progress = (completedTasks / tasks.length) * 100

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Daily Practice
          </CardTitle>
          <Badge variant="outline" className="text-primary">
            {totalXP}/{maxXP} XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {completedTasks}/{tasks.length} completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                task.completed
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  : "bg-background"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  task.completed ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground"
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                +{task.xp} XP
              </Badge>
            </div>
          ))}
        </div>

        {completedTasks === tasks.length ? (
          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
            🎉 All Complete! Claim Bonus XP
          </Button>
        ) : (
          <Button className="w-full bg-transparent" variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Continue Practice
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
