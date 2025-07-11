"use client"

import {
  BookOpen,
  Video,
  Brain,
  Clock,
  MessageCircle,
  Volume2,
  Briefcase,
  Presentation,
  PenTool,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react"
import type { OnboardingData } from "@/types/onboarding-data" // Declare the OnboardingData variable

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LearningProgressPanelProps {
  onboardingData?: OnboardingData
}

export function LearningProgressPanel({ onboardingData }: LearningProgressPanelProps = {}) {
  const getPersonalizedStats = (onboardingData?: OnboardingData) => {
    if (!onboardingData) {
      return {
        vocabulary: { learned: 35, target: 50, icon: BookOpen },
        videos: { watched: 8, target: 10, icon: Video },
        grammar: { completed: 12, target: 15, icon: Brain },
        speaking: { minutes: 145, target: 180, icon: Clock },
      }
    }

    const { goal, level } = onboardingData
    const multiplier = level === "beginner" ? 0.7 : level === "intermediate" ? 1 : 1.3

    switch (goal.id) {
      case "daily-conversation":
        return {
          conversations: {
            completed: Math.floor(25 * multiplier),
            target: Math.floor(35 * multiplier),
            icon: MessageCircle,
          },
          vocabulary: { learned: Math.floor(40 * multiplier), target: Math.floor(60 * multiplier), icon: BookOpen },
          pronunciation: { practiced: Math.floor(15 * multiplier), target: Math.floor(20 * multiplier), icon: Volume2 },
          speaking: { minutes: Math.floor(120 * multiplier), target: Math.floor(180 * multiplier), icon: Clock },
        }
      case "professional-corporate":
        return {
          meetings: { simulated: Math.floor(8 * multiplier), target: Math.floor(12 * multiplier), icon: Briefcase },
          vocabulary: { learned: Math.floor(50 * multiplier), target: Math.floor(75 * multiplier), icon: BookOpen },
          presentations: {
            completed: Math.floor(5 * multiplier),
            target: Math.floor(8 * multiplier),
            icon: Presentation,
          },
          writing: { exercises: Math.floor(10 * multiplier), target: Math.floor(15 * multiplier), icon: PenTool },
        }
      case "ielts-academic":
        return {
          practice_tests: {
            completed: Math.floor(3 * multiplier),
            target: Math.floor(5 * multiplier),
            icon: GraduationCap,
          },
          vocabulary: { learned: Math.floor(60 * multiplier), target: Math.floor(100 * multiplier), icon: BookOpen },
          essays: { written: Math.floor(4 * multiplier), target: Math.floor(8 * multiplier), icon: PenTool },
          listening: { hours: Math.floor(8 * multiplier), target: Math.floor(12 * multiplier), icon: Clock },
        }
      default:
        return {
          vocabulary: { learned: Math.floor(35 * multiplier), target: Math.floor(50 * multiplier), icon: BookOpen },
          practice: { sessions: Math.floor(20 * multiplier), target: Math.floor(30 * multiplier), icon: Target },
          speaking: { minutes: Math.floor(100 * multiplier), target: Math.floor(150 * multiplier), icon: Clock },
          progress: { completed: Math.floor(15 * multiplier), target: Math.floor(25 * multiplier), icon: TrendingUp },
        }
    }
  }

  const weeklyStats = getPersonalizedStats(onboardingData)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="space-y-4 mt-4">
            {Object.entries(weeklyStats).map(([key, stat]) => {
              const percentage =
                ((stat.learned ||
                  stat.watched ||
                  stat.completed ||
                  stat.minutes ||
                  stat.practiced ||
                  stat.simulated ||
                  stat.exercises ||
                  stat.written ||
                  stat.hours ||
                  stat.sessions ||
                  stat.completed) /
                  stat.target) *
                100
              const Icon = stat.icon

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium capitalize">
                        {key === "speaking" ? "Speaking Time" : key.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.learned ||
                        stat.watched ||
                        stat.completed ||
                        stat.minutes ||
                        stat.practiced ||
                        stat.simulated ||
                        stat.exercises ||
                        stat.written ||
                        stat.hours ||
                        stat.sessions}
                      /{stat.target}
                      {key === "speaking" || key === "listening" ? " min" : ""}
                    </span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                </div>
              )
            })}
          </TabsContent>
          <TabsContent value="month" className="space-y-4 mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Monthly stats coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
