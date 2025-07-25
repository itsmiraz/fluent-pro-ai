"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, Zap, Target, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type UserLevel = "beginner" | "intermediate" | "advanced"

interface UserLevelOption {
  id: UserLevel
  title: string
  description: string
  features: string[]
  icon: any
  color: string
  bgColor: string
}

const levelOptions: UserLevelOption[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "I'm just starting my English learning journey",
    features: [
      "Basic vocabulary and phrases",
      "Simple conversation practice",
      "Fundamental grammar lessons",
      "Slow-paced speaking exercises",
    ],
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "I can have basic conversations but want to improve",
    features: [
      "Expanded vocabulary building",
      "Complex conversation scenarios",
      "Advanced grammar concepts",
      "Natural speaking rhythm practice",
    ],
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "I'm fluent but want to perfect my skills",
    features: [
      "Sophisticated vocabulary",
      "Professional communication",
      "Nuanced grammar mastery",
      "Native-like pronunciation",
    ],
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  },
]

interface UserLevelSelectionProps {
  onLevelSelect: (level: UserLevel) => void
  onBack: () => void
  selectedGoal: string
}

export function UserLevelSelection({ onLevelSelect, onBack, selectedGoal }: UserLevelSelectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null)

  const handleContinue = () => {
    if (selectedLevel) {
      onLevelSelect(selectedLevel)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            How confident are you currently in English?
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            This helps us fine-tune your vocabulary difficulty and speaking prompts for{" "}
            <span className="font-semibold text-primary">{selectedGoal}</span>.
          </p>
        </div>
      </div>

      {/* Level Cards */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {levelOptions.map((level) => {
          const Icon = level.icon
          const isSelected = selectedLevel === level.id

          return (
            <Card
              key={level.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                isSelected ? `${level.bgColor} ring-2 ring-primary shadow-lg` : "hover:bg-muted/50",
              )}
              onClick={() => setSelectedLevel(level.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {/* Icon and Title */}
                  <div className="text-center space-y-3">
                    <div
                      className={cn(
                        "w-14 h-14 md:w-16 md:h-16 mx-auto rounded-full flex items-center justify-center",
                        isSelected ? "bg-white/80 dark:bg-black/20" : "bg-muted",
                      )}
                    >
                      <Icon
                        className={cn("w-7 h-7 md:w-8 md:h-8", isSelected ? level.color : "text-muted-foreground")}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg md:text-xl mb-1">{level.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{level.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      What you'll get:
                    </p>
                    <ul className="space-y-1.5">
                      {level.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs md:text-sm">
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                              isSelected ? level.color.replace("text-", "bg-") : "bg-muted-foreground",
                            )}
                          />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 md:pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!selectedLevel}
          size="lg"
          className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold"
        >
          Complete Setup
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center items-center space-x-2 pt-4">
        <div className="w-8 md:w-10 h-1 bg-primary rounded-full"></div>
        <div className="w-8 md:w-10 h-1 bg-primary rounded-full"></div>
      </div>
      <p className="text-center text-xs md:text-sm text-muted-foreground">Step 2 of 2</p>
    </div>
  )
}
