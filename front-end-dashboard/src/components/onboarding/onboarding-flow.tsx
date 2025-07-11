"use client"

import { useState } from "react"
import { GoalSelection, type LearningGoal } from "./goal-selection"
import { UserLevelSelection, type UserLevel } from "./user-level-selection"

export interface OnboardingData {
  goal: LearningGoal | { id: string; title: string; description: string; custom: true }
  level: UserLevel
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<"goal" | "level">("goal")
  const [selectedGoal, setSelectedGoal] = useState<
    LearningGoal | { id: string; title: string; description: string; custom: true } | null
  >(null)

  const handleGoalSelect = (goal: LearningGoal | { id: string; title: string; description: string; custom: true }) => {
    setSelectedGoal(goal)
    setCurrentStep("level")
  }

  const handleLevelSelect = (level: UserLevel) => {
    if (selectedGoal) {
      onComplete({
        goal: selectedGoal,
        level,
      })
    }
  }

  const handleBack = () => {
    setCurrentStep("goal")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="w-full">
        {currentStep === "goal" && <GoalSelection onGoalSelect={handleGoalSelect} />}

        {currentStep === "level" && selectedGoal && (
          <UserLevelSelection onLevelSelect={handleLevelSelect} onBack={handleBack} selectedGoal={selectedGoal.title} />
        )}
      </div>
    </div>
  )
}
