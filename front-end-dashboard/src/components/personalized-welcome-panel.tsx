"use client"

import {
  MessageCircle,
  Briefcase,
  Handshake,
  GraduationCap,
  Presentation,
  PenTool,
  Target,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { OnboardingData } from "@/components/onboarding/onboarding-flow"

const goalIcons = {
  "daily-conversation": MessageCircle,
  "professional-corporate": Briefcase,
  "sales-client-meetings": Handshake,
  "ielts-academic": GraduationCap,
  "public-speaking": Presentation,
  "writing-email": PenTool,
  custom: Target,
}

const goalColors = {
  "daily-conversation": "text-blue-600 bg-blue-50 dark:bg-blue-950",
  "professional-corporate": "text-purple-600 bg-purple-50 dark:bg-purple-950",
  "sales-client-meetings": "text-green-600 bg-green-50 dark:bg-green-950",
  "ielts-academic": "text-orange-600 bg-orange-50 dark:bg-orange-950",
  "public-speaking": "text-red-600 bg-red-50 dark:bg-red-950",
  "writing-email": "text-teal-600 bg-teal-50 dark:bg-teal-950",
  custom: "text-gray-600 bg-gray-50 dark:bg-gray-950",
}

const levelColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

interface PersonalizedWelcomePanelProps {
  onboardingData: OnboardingData
}

export function PersonalizedWelcomePanel({ onboardingData }: PersonalizedWelcomePanelProps) {
  const { goal, level } = onboardingData
  const Icon = goalIcons[goal.id as keyof typeof goalIcons] || Target
  const colorClasses = goalColors[goal.id as keyof typeof goalColors] || goalColors.custom

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <CardContent className="relative p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Icon and Goal Info */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center ${colorClasses}`}>
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Personalized for you</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-1">Ready to master {goal.title.toLowerCase()}?</h2>
              <p className="text-sm text-muted-foreground">
                Your dashboard is now customized for {level} level learners
              </p>
            </div>
          </div>

          {/* Level Badge and Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            <Badge variant="secondary" className={`${levelColors[level]} font-medium`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </Badge>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Target className="w-4 h-4 mr-2" />
              View Learning Path
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg md:text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Days Active</p>
          </div>
          <div className="text-center">
            <p className="text-lg md:text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Goals Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg md:text-xl font-bold text-primary">0%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
