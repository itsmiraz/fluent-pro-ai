"use client"

import { useState } from "react"
import {
  MessageCircle,
  Briefcase,
  Handshake,
  GraduationCap,
  Presentation,
  PenTool,
  Plus,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface LearningGoal {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
}

const learningGoals: LearningGoal[] = [
  {
    id: "daily-conversation",
    title: "Daily conversation fluency",
    description: "Improve everyday speaking skills and casual conversations",
    icon: MessageCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  },
  {
    id: "professional-corporate",
    title: "Professional / Corporate English",
    description: "Master workplace communication and business terminology",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  },
  {
    id: "sales-client-meetings",
    title: "English for Sales & Client Meetings",
    description: "Excel in sales presentations and client interactions",
    icon: Handshake,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  },
  {
    id: "ielts-academic",
    title: "IELTS / Academic Test Preparation",
    description: "Prepare for English proficiency tests and academic writing",
    icon: GraduationCap,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  },
  {
    id: "public-speaking",
    title: "Public Speaking & Presentations",
    description: "Build confidence in presentations and public speaking",
    icon: Presentation,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  },
  {
    id: "writing-email",
    title: "Writing & Email Communication",
    description: "Improve written English and professional correspondence",
    icon: PenTool,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800",
  },
]

interface GoalSelectionProps {
  onGoalSelect: (goal: LearningGoal | { id: string; title: string; description: string; custom: true }) => void
}

export function GoalSelection({ onGoalSelect }: GoalSelectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [customGoal, setCustomGoal] = useState("")

  const handleGoalClick = (goalId: string) => {
    if (goalId === "other") {
      setShowOtherInput(true)
      setSelectedGoal("other")
    } else {
      setShowOtherInput(false)
      setSelectedGoal(goalId)
    }
  }

  const handleContinue = () => {
    if (selectedGoal === "other" && customGoal.trim()) {
      onGoalSelect({
        id: "custom",
        title: customGoal,
        description: "Custom learning goal",
        custom: true,
      })
    } else if (selectedGoal && selectedGoal !== "other") {
      const goal = learningGoals.find((g) => g.id === selectedGoal)
      if (goal) {
        onGoalSelect(goal)
      }
    }
  }

  const canContinue = selectedGoal && (selectedGoal !== "other" || customGoal.trim().length > 0)

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
          <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            What's your main goal for learning English?
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your content will be personalized based on this selection to help you achieve your specific objectives.
          </p>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learningGoals.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoal === goal.id

          return (
            <Card
              key={goal.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                isSelected ? `${goal.bgColor} ring-2 ring-primary shadow-lg` : "hover:bg-muted/50",
              )}
              onClick={() => handleGoalClick(goal.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  <div
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-white/80 dark:bg-black/20" : "bg-muted",
                    )}
                  >
                    <Icon className={cn("w-6 h-6 md:w-7 md:h-7", isSelected ? goal.color : "text-muted-foreground")} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2 leading-tight">🗣️ {goal.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{goal.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Other Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
            selectedGoal === "other"
              ? "bg-gray-50 dark:bg-gray-950 ring-2 ring-primary shadow-lg border-gray-200 dark:border-gray-800"
              : "hover:bg-muted/50",
          )}
          onClick={() => handleGoalClick("other")}
        >
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center",
                  selectedGoal === "other" ? "bg-white/80 dark:bg-black/20" : "bg-muted",
                )}
              >
                <Plus
                  className={cn(
                    "w-6 h-6 md:w-7 md:h-7",
                    selectedGoal === "other" ? "text-gray-600" : "text-muted-foreground",
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2 leading-tight">➕ Other</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  I have a different specific goal in mind
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Goal Input */}
      {showOtherInput && (
        <div className="max-w-md mx-auto space-y-3 md:space-y-4 p-4 md:p-6 bg-muted/30 rounded-lg border">
          <Label htmlFor="custom-goal" className="text-sm md:text-base font-medium">
            What's your specific English learning goal?
          </Label>
          <Input
            id="custom-goal"
            placeholder="e.g., English for medical professionals, travel communication..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4 md:pt-6">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold"
        >
          Continue
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center items-center space-x-2 pt-4">
        <div className="w-8 md:w-10 h-1 bg-primary rounded-full"></div>
        <div className="w-8 md:w-10 h-1 bg-muted rounded-full"></div>
      </div>
      <p className="text-center text-xs md:text-sm text-muted-foreground">Step 1 of 2</p>
    </div>
  )
}
